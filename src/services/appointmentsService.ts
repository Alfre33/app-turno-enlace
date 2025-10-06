import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  limit as qLimit,
  query,
  QueryConstraint,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../libs/firebase";
import {
  Appointment,
  AppointmentDoc,
  AppointmentInput,
  UnsubscribeFn,
} from "../types/models";

/** Referencia a la colección */
const appointmentsRef = collection(db, "appointments");

/** Opciones de filtro en list/subscribe */
export type AppointmentFilterOptions = {
  categoryId?: string;
  after?: Date; // filtra por fecha >= after
  before?: Date; // filtra por fecha <= before
  limit?: number; // top-N
  order?: "asc" | "desc"; // por fecha
};

type SnapshotCallback = (rows: Appointment[]) => void;
type PartialAppointmentInput = Partial<AppointmentInput>;

/** Map Firestore -> App model */
function mapAppointment(snap: DocumentSnapshot<DocumentData>): Appointment {
  const data = (snap.data() as Partial<AppointmentDoc> | undefined) ?? {};
  const ts = data.date;

  return {
    id: snap.id,
    title: data.title ?? "",
    date: ts instanceof Timestamp ? ts.toDate() : new Date(0),
    notes: (data.notes ?? null) || null,
    categoryId: (data.categoryId ?? null) || null,
  };
}

/** Valida y transforma payload de creación */
function sanitizeCreate(input: AppointmentInput): AppointmentDoc {
  const title = input.title.trim();
  if (!title) throw new Error("El título de la cita es obligatorio.");

  if (!(input.date instanceof Date) || Number.isNaN(input.date.getTime())) {
    throw new Error("La fecha de la cita es obligatoria.");
  }

  const payload: AppointmentDoc = {
    title,
    date: Timestamp.fromDate(input.date),
  };

  if (input.notes?.trim()) payload.notes = input.notes.trim();

  const categoryId = input.categoryId?.trim();
  if (categoryId) payload.categoryId = categoryId;

  return payload;
}

/** Valida y transforma payload de actualización parcial */
function sanitizePatch(
  input: PartialAppointmentInput
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  if (typeof input.title === "string") {
    const t = input.title.trim();
    if (!t) throw new Error("El título no puede estar vacío.");
    out.title = t;
  }

  if (input.date instanceof Date) {
    if (Number.isNaN(input.date.getTime())) throw new Error("Fecha inválida.");
    out.date = Timestamp.fromDate(input.date);
  }

  if (typeof input.notes === "string") {
    const n = input.notes.trim();
    out.notes = n ? n : deleteField();
  }

  if (input.categoryId !== undefined) {
    const c = input.categoryId ? String(input.categoryId).trim() : "";
    out.categoryId = c ? c : deleteField();
  }

  return out;
}

/** Arma constraints para list/subscribe */
function buildConstraints(
  opt: AppointmentFilterOptions = {}
): QueryConstraint[] {
  const cs: QueryConstraint[] = [];

  if (opt.categoryId?.trim()) {
    cs.push(where("categoryId", "==", opt.categoryId.trim()));
  }
  if (opt.after instanceof Date && !Number.isNaN(opt.after.getTime())) {
    cs.push(where("date", ">=", Timestamp.fromDate(opt.after)));
  }
  if (opt.before instanceof Date && !Number.isNaN(opt.before.getTime())) {
    cs.push(where("date", "<=", Timestamp.fromDate(opt.before)));
  }

  cs.push(orderBy("date", opt.order ?? "asc"));

  if (opt.limit && opt.limit > 0) cs.push(qLimit(opt.limit));

  return cs;
}

/* ---------- API ---------- */

export async function createAppointment(
  input: AppointmentInput
): Promise<Appointment> {
  const payload = sanitizeCreate(input);
  const ref = await addDoc(appointmentsRef, payload);
  const snap = await getDoc(ref);
  return mapAppointment(snap);
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  const snap = await getDoc(doc(appointmentsRef, id));
  return snap.exists() ? mapAppointment(snap) : null;
}

export async function getAppointments(
  opt: AppointmentFilterOptions = {}
): Promise<Appointment[]> {
  const q = query(appointmentsRef, ...buildConstraints(opt));
  const s = await getDocs(q);
  return s.docs.map(mapAppointment);
}

export function subscribeToAppointments(
  cb: SnapshotCallback,
  onError?: (e: Error) => void,
  opt: AppointmentFilterOptions = {}
): UnsubscribeFn {
  const q = query(appointmentsRef, ...buildConstraints(opt));
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map(mapAppointment)),
    (err) => onError?.(err as Error)
  );
}

export async function updateAppointment(
  id: string,
  input: PartialAppointmentInput
): Promise<void> {
  const patch = sanitizePatch(input);
  if (Object.keys(patch).length === 0) return;
  await updateDoc(doc(appointmentsRef, id), patch);
}

export async function deleteAppointment(id: string): Promise<void> {
  await deleteDoc(doc(appointmentsRef, id));
}
