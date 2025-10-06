import { auth } from "@/src/libs/firebase";
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type LoginPayload = Readonly<{
  email: string;
  password: string;
}>;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isInitializing: boolean;
  login: (p: LoginPayload) => Promise<void>;
  register: (p: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
  isAuthenticating: boolean;
  authError: string | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

function mapFirebaseError(code?: string) {
  switch (code) {
    case "auth/invalid-email":
      return "El formato del correo no es válido.";
    case "auth/missing-password":
      return "Ingresa tu contraseña.";
    case "auth/user-disabled":
      return "Tu cuenta está deshabilitada.";
    case "auth/user-not-found":
      return "No existe una cuenta con ese correo.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Correo o contraseña incorrectos.";
    case "auth/email-already-in-use":
      return "Ese correo ya está registrado.";
    case "auth/weak-password":
      return "La contraseña es muy débil.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta más tarde.";
    case "auth/network-request-failed":
      return "Sin conexión. Verifica tu red.";
    default:
      return "No pudimos completar la acción. Intenta de nuevo.";
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setLoading(false);
    });
    return unsub;
  }, []);

  const clearError = () => setAuthError(null);

  const login: (p: LoginPayload) => Promise<void> = async ({
    email,
    password,
  }) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Firebase persiste automáticamente con SecureStore
    } catch (err) {
      const code = (err as { code?: string }).code;
      setAuthError(mapFirebaseError(code));
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const register: (p: LoginPayload) => Promise<void> = async ({
    email,
    password,
  }) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      try {
        await sendEmailVerification(cred.user);
      } catch {}
    } catch (err) {
      const code = (err as { code?: string }).code;
      setAuthError(mapFirebaseError(code));
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    setAuthError(null);
    await signOut(auth);
    // Firebase limpia automáticamente la sesión de SecureStore
  };

  const refresh = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser(auth.currentUser);
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      isInitializing: loading,
      login,
      register,
      logout,
      refresh,
      clearError,
      isAuthenticating,
      authError,
    }),
    [user, loading, isAuthenticating, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
