export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function buildUrl(path: string, query?: Record<string, string | number | boolean | null | undefined>) {
  const url = new URL(`${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

function parseResponse<T>(response: Response) {
  return response.text().then((text) => {
    if (!text) {
      return null as unknown as T;
    }
    return JSON.parse(text) as T;
  });
}

export async function apiFetch<T>(path: string, init: RequestInit = {}, query?: Record<string, string | number | boolean | null | undefined>) {
  const headers = new Headers(init.headers ?? {});

  if (init.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(path, query), { ...init, headers });
  const data = await parseResponse<T>(response);

  if (!response.ok) {
    // Extract error message from response data if available
    const errorMessage = (data as { message?: string })?.message || response.statusText || "Erreur API";
    throw new ApiError(errorMessage, response.status, data);
  }

  return data;
}

export function getAuthToken() {
  try {
    return sessionStorage.getItem("servidom_token") ?? undefined;
  } catch {
    return undefined;
  }
}

export async function authFetch<T>(path: string, init: RequestInit = {}, query?: Record<string, string | number | boolean | null | undefined>) {
  const token = getAuthToken();
  const headers = new Headers(init.headers ?? {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return apiFetch<T>(path, { ...init, headers }, query);
}

/** Refresh current user profile and token from server */
export async function refreshMe() {
  return authFetch<{ token: string; user: import("@/context/AuthContext").AuthUser }>("/auth/me", { method: "GET" });
}
