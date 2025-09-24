import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const AUTH_STORAGE_KEY = "@turno-enlace/auth";
const EMAIL_STORAGE_KEY = "@turno-enlace/remember-email";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type AuthUser = {
  id: string;
  name: string;
  email: string;
  token: string;
  remember: boolean;
  createdAt: string;
};

type LoginPayload = {
  email: string;
  password: string;
  remember: boolean;
};

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isInitializing: boolean;
  isAuthenticating: boolean;
  authError: string | null;
  rememberedEmail: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [rememberedEmail, setRememberedEmail] = useState<string | null>(null);

  const loadStoredSession = useCallback(async () => {
    try {
      const [rawUser, rawEmail] = await Promise.all([
        AsyncStorage.getItem(AUTH_STORAGE_KEY),
        AsyncStorage.getItem(EMAIL_STORAGE_KEY),
      ]);

      if (rawUser) {
        const parsed: AuthUser = JSON.parse(rawUser);
        setUser(parsed);
      } else {
        setUser(null);
      }

      setRememberedEmail(rawEmail);
    } catch (error) {
      console.warn("Failed to load auth session", error);
      setAuthError(
        "We couldn't restore your last session. Please sign in again.",
      );
      setUser(null);
      setRememberedEmail(null);
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      setIsInitializing(true);
      await loadStoredSession();
      setIsInitializing(false);
    };

    void bootstrap();
  }, [loadStoredSession]);

  const persistSession = useCallback(async (currentUser: AuthUser) => {
    if (currentUser.remember) {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      await AsyncStorage.setItem(EMAIL_STORAGE_KEY, currentUser.email);
      setRememberedEmail(currentUser.email);
    } else {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      await AsyncStorage.removeItem(EMAIL_STORAGE_KEY);
      setRememberedEmail(null);
    }
  }, []);

  const login = useCallback(
    async ({ email, password, remember }: LoginPayload) => {
      try {
        setIsAuthenticating(true);
        setAuthError(null);

        await delay(600);

        const normalizedEmail = email.trim().toLowerCase();
        const sanitizedPassword = password.trim();
        if (!sanitizedPassword) {
          throw new Error("Password is required");
        }
        const derivedName = normalizedEmail
          .split("@")[0]
          ?.replace(/\W+/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        if (!derivedName) {
          throw new Error("Unable to derive name from email");
        }

        const authenticatedUser: AuthUser = {
          id: normalizedEmail,
          email: normalizedEmail,
          name: derivedName
            .split(" ")
            .map((segment) =>
              segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase(),
            )
            .join(" "),
          token: `token-${Date.now()}`,
          remember,
          createdAt: new Date().toISOString(),
        };

        setUser(authenticatedUser);
        await persistSession(authenticatedUser);
      } catch (error) {
        console.error("Login error", error);
        setUser(null);
        setAuthError("Invalid credentials. Please verify and try again.");
        throw error;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [persistSession],
  );

  const register = useCallback(
    async ({ fullName, email, password }: RegisterPayload) => {
      try {
        setIsAuthenticating(true);
        setAuthError(null);

        await delay(800);

        const normalizedEmail = email.trim().toLowerCase();
        const sanitizedName = fullName
          .trim()
          .split(" ")
          .filter(Boolean)
          .map(
            (segment) =>
              segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase(),
          )
          .join(" ");

        if (!sanitizedName) {
          throw new Error("Name is required");
        }

        const newUser: AuthUser = {
          id: normalizedEmail,
          email: normalizedEmail,
          name: sanitizedName,
          token: `token-${Date.now()}`,
          remember: true,
          createdAt: new Date().toISOString(),
        };

        setUser(newUser);
        await persistSession(newUser);
      } catch (error) {
        console.error("Registration error", error);
        setUser(null);
        setAuthError(
          "We couldn't create your account. Double-check your details and try again.",
        );
        throw error;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    setAuthError(null);
    setIsAuthenticating(true);
    try {
      await delay(300);
      await AsyncStorage.multiRemove([AUTH_STORAGE_KEY, EMAIL_STORAGE_KEY]);
      setUser(null);
      setRememberedEmail(null);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadStoredSession();
  }, [loadStoredSession]);

  const clearError = useCallback(() => setAuthError(null), []);

  const value = useMemo(
    () => ({
      user,
      isInitializing,
      isAuthenticating,
      authError,
      rememberedEmail,
      login,
      register,
      logout,
      refresh,
      clearError,
    }),
    [
      authError,
      clearError,
      isAuthenticating,
      isInitializing,
      login,
      logout,
      refresh,
      register,
      rememberedEmail,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
