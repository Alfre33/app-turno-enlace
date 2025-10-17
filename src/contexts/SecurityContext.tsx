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
import * as LocalAuth from "expo-local-authentication";
import { auth } from "@/src/libs/firebase";

export type LoginPayload = { email: string; password: string; remember?: boolean };
type RegisterPayload = Omit<LoginPayload, "remember">;

const SECURE_KEYS = {
  REMEMBER: "remember",
  BIOMETRIC_ENABLED: "biometric_enabled",
  LAST_BIOMETRIC_AT: "last_biometric_at",
} as const;

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

  biometricAvailable: boolean;
  biometricEnabled: boolean;
  setBiometricEnabled: (v: boolean) => Promise<void>;
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
    case "auth/biometric-failed":
      return "No se pudo verificar tu identidad con biometría.";
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

  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const hasHw = await LocalAuth.hasHardwareAsync();
        const enrolled = await LocalAuth.isEnrolledAsync();
        setBiometricAvailable(Boolean(hasHw && enrolled));
      } catch {
        setBiometricAvailable(false);
      }
      const enabled = (await SecureStore.getItemAsync(SECURE_KEYS.BIOMETRIC_ENABLED)) === "1";
      setBiometricEnabledState(enabled);
    };
    init();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setLoading(false);
    });
    return unsub;
  }, []);

  const clearError = () => setAuthError(null);

  const setBiometricEnabled = async (v: boolean) => {
    setBiometricEnabledState(v);
    await SecureStore.setItemAsync(SECURE_KEYS.BIOMETRIC_ENABLED, v ? "1" : "0").catch(() => {});
  };

  const promptBiometric = async (reason = "Verifica tu identidad") => {
    if (!biometricAvailable || !biometricEnabled) return true; 
    try {
      const res = await LocalAuth.authenticateAsync({
        promptMessage: reason,
        cancelLabel: "Cancelar",
        fallbackLabel: "Usar código",
        disableDeviceFallback: false,
      });
      if (res.success) {
        await SecureStore.setItemAsync(SECURE_KEYS.LAST_BIOMETRIC_AT, String(Date.now())).catch(() => {});
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const login = async ({ email, password, remember = false }: LoginPayload) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      if (cred.user && !cred.user.emailVerified) {
        try {
          await sendEmailVerification(cred.user);
        } catch {}
        const err = { code: "auth/email-not-verified" };
        setAuthError("Verifica tu correo para continuar. Te enviamos un email.");
        throw err as any;
      }

      const ok = await promptBiometric("Autenticación biométrica requerida");
      if (!ok) {
        await signOut(auth);
        const err = { code: "auth/biometric-failed" };
        setAuthError(mapFirebaseError("auth/biometric-failed"));
        throw err as any;
      }

      if (remember) {
        await SecureStore.setItemAsync(SECURE_KEYS.REMEMBER, "1").catch(() => {});
      } else {
        await SecureStore.deleteItemAsync(SECURE_KEYS.REMEMBER).catch(() => {});
      }
    } catch (e: any) {
      const code = e?.code as string | undefined;
      if (code !== "auth/email-not-verified" && code !== "auth/biometric-failed") {
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
      } catch {}
    } catch (e: any) {
      setAuthError(mapFirebaseError(e?.code));
      throw e;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    setAuthError(null);
    await SecureStore.deleteItemAsync(SECURE_KEYS.REMEMBER).catch(() => {});
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

      biometricAvailable,
      biometricEnabled,
      setBiometricEnabled,
    }),
    [
      user,
      loading,
      isAuthenticating,
      authError,
      biometricAvailable,
      biometricEnabled,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
