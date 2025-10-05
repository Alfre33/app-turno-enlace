import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import * as SecureStore from "expo-secure-store";
import { auth } from "@/src/libs/firebase";

export type LoginPayload = { email: string; password: string; remember?: boolean };
type RegisterPayload = Omit<LoginPayload, "remember">;

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  isInitializing: boolean; 

  login: (p: LoginPayload) => Promise<void>;
  register: (p: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
  isAuthenticating: boolean;
  authError: string | null;
};

export function mapFirebaseError(code?: string) {
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
    case "auth/invalid-login-credentials":
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

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const login = async ({ email, password, remember = false }: LoginPayload) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      if (cred.user && !cred.user.emailVerified) {
        try {
          await sendEmailVerification(cred.user);
        } catch {
          /* no-op */
        }
        const err = { code: "auth/email-not-verified" };
        setAuthError("Verifica tu correo para continuar. Te enviamos un email.");
        throw err as any;
      }

      if (remember) {
        await SecureStore.setItemAsync("remember", "1").catch(() => {});
      } else {
        await SecureStore.deleteItemAsync("remember").catch(() => {});
      }
    } catch (e: any) {
      const code = e?.code as string | undefined;
      if (code !== "auth/email-not-verified") {
        setAuthError(mapFirebaseError(code));
      }
      throw e;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const register = async ({ email, password }: RegisterPayload) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      try {
        await sendEmailVerification(cred.user);
      } catch {
        /* no-op */
      }
    } catch (e: any) {
      setAuthError(mapFirebaseError(e?.code));
      throw e;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    setAuthError(null);
    await SecureStore.deleteItemAsync("remember").catch(() => {});
    await signOut(auth);
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
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
