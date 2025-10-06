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
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../libs/firebase";
import { Category, CategoryDoc, CategoryInput, UnsubscribeFn } from "../types/models";



const categoriesRef = collection(db, "categories");

type SnapshotCallback = (rows: Category[]) => void;
type PartialCategoryInput = Partial<CategoryInput>;

function mapCategory(snap: DocumentSnapshot<DocumentData>): Category {
  const data = (snap.data() as Partial<CategoryDoc> | undefined) ?? {};
  return {
    id: snap.id,
    name: data.name ?? "",
    color: (data.color ?? null) || null,
  };
}

function sanitizeCreate(input: CategoryInput): CategoryDoc {
  const name = input.name.trim();
  if (!name) throw new Error("El nombre de la categoría es obligatorio.");
  const payload: CategoryDoc = { name };
  const color = input.color?.trim();
  if (color) payload.color = color;
  return payload;
}

function sanitizePatch(input: PartialCategoryInput): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  if (typeof input.name === "string") {
    const n = input.name.trim();
    if (!n) throw new Error("El nombre no puede estar vacío.");
    out.name = n;
  }

  if (typeof input.color === "string") {
    const c = input.color.trim();
    out.color = c ? c : deleteField();
  }

  return out;
}

/* ---------- API ---------- */

export async function createCategory(input: CategoryInput): Promise<Category> {
  const payload = sanitizeCreate(input);
  const ref = await addDoc(categoriesRef, payload);
  const snap = await getDoc(ref);
  return mapCategory(snap);
}

export async function getCategory(id: string): Promise<Category | null> {
  const snap = await getDoc(doc(categoriesRef, id));
  return snap.exists() ? mapCategory(snap) : null;
}

export async function getCategories(): Promise<Category[]> {
  const q = query(categoriesRef, orderBy("name", "asc"));
  const s = await getDocs(q);
  return s.docs.map(mapCategory);
}

export function subscribeToCategories(
  cb: SnapshotCallback,
  onError?: (e: Error) => void
): UnsubscribeFn {
  const q = query(categoriesRef, orderBy("name", "asc"));
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map(mapCategory)),
    (err) => onError?.(err as Error)
  );
}

export async function updateCategory(
  id: string,
  input: PartialCategoryInput
): Promise<void> {
  const patch = sanitizePatch(input);
  if (Object.keys(patch).length === 0) return;
  await updateDoc(doc(categoriesRef, id), patch);
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(categoriesRef, id));
}
