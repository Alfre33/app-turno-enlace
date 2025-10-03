// types/models.ts
import { Timestamp } from "firebase/firestore";

/** ---------- Categorías ---------- */

export type Category = {
  id: string;
  name: string;
  color?: string | null; // hex #RRGGBB opcional
};

export type CategoryInput = {
  name: string;
  color?: string | null;
};

/**
 * Representación en Firestore.
 * (mismos campos que CategoryInput; puedes añadir createdAt/updatedAt si los usas)
 */
export type CategoryDoc = CategoryInput;

/** ---------- Citas / Appointments ---------- */

export type Appointment = {
  id: string;
  title: string;
  date: Date; // en la app trabajamos con Date nativo
  notes?: string | null;
  categoryId?: string | null;
};

export type AppointmentInput = {
  title: string;
  date: Date;
  notes?: string | null;
  categoryId?: string | null;
};

/**
 * Representación en Firestore: la fecha se guarda como Timestamp.
 * (si agregas auditoría, puedes extender con createdAt/updatedAt: Timestamp)
 */
export type AppointmentDoc = Omit<AppointmentInput, "date"> & {
  date: Timestamp;
};

/** ---------- Utilidades ---------- */

export type UnsubscribeFn = () => void;
