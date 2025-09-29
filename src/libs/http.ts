
export type HttpError = {
  status?: number;
  code?: string;
  message: string;
};

const DEFAULT_TIMEOUT_MS = 7000;

export async function fetchJson<T>(url: string, init: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...init, signal: controller.signal });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const err: HttpError = {
        status: res.status,
        message: text || `HTTP ${res.status}`,
      };
      throw err;
    }

    return (await res.json()) as T;
  } catch (e: any) {
   
    if (e?.name === "AbortError") {
      const err: HttpError = { code: "timeout", message: "La solicitud tardó demasiado." };
      throw err;
    }

   
    if (e?.message?.includes?.("Network request failed")) {
      const err: HttpError = { code: "offline", message: "Parece que no hay conexión a internet." };
      throw err;
    }

   
    const err: HttpError = { message: e?.message || "Error de red" };
    throw err;
  } finally {
    clearTimeout(id);
  }
}
