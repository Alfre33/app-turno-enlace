import { auth } from "@/src/libs/firebase";
import {
    User,
    UserCredential,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

/** Suscribirse al estado de auth. Devuelve la función para desuscribirse */
export function subscribeAuth(cb: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, cb);
}

/** Usuario actual (o null) */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/** Forzar refresh del usuario y devolverlo */
export async function refreshCurrentUser(): Promise<User | null> {
  if (!auth.currentUser) return null;
  await auth.currentUser.reload();
  return auth.currentUser;
}

/** Login por email/contraseña */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  return await signInWithEmailAndPassword(auth, email, password);
}

/** Registro por email/contraseña (envía verificación por defecto) */
export async function registerWithEmail(
  email: string,
  password: string,
  sendVerificationEmail: boolean = true
): Promise<UserCredential> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (sendVerificationEmail) {
    try {
      await sendEmailVerification(cred.user);
    } catch {}
  }
  return cred;
}

/** Logout */
export async function logout(): Promise<void> {
  await signOut(auth);
}

/** Mapeo de errores de Firebase a mensajes para UI */
export function mapAuthError(code?: string): string {
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
