// In production, prefer VITE_API_BASE. If not provided, fall back to current origin.
const ENV_API_BASE = import.meta.env.VITE_API_BASE;
const RUNTIME_BASE =
  ENV_API_BASE && ENV_API_BASE.length > 0
    ? ENV_API_BASE
    : (typeof window !== "undefined" && import.meta.env.PROD ? window.location.origin : "");

export function apiFetch(path: string, options?: RequestInit) {
  return fetch(`${RUNTIME_BASE}${path}`, options);
}

