// In development, use local backend. In production, use VITE_API_BASE or current origin.
const ENV_API_BASE = import.meta.env.VITE_API_BASE;
const IS_DEV = import.meta.env.DEV;

const RUNTIME_BASE = IS_DEV
  ? "http://localhost:3001"  // Always use local backend in development
  : (ENV_API_BASE && ENV_API_BASE.length > 0
      ? ENV_API_BASE
      : (typeof window !== "undefined" ? window.location.origin : ""));

// Temporary debug: log what base URL the app is using at runtime
if (typeof window !== "undefined") {
  console.log("API_BASE at runtime:", RUNTIME_BASE, IS_DEV ? "(dev mode)" : "(prod mode)");
}

export function apiFetch(path: string, options?: RequestInit) {
  return fetch(`${RUNTIME_BASE}${path}`, options);
}

