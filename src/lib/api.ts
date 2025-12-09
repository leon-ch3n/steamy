// In production, prefer VITE_API_BASE. If not provided, fall back to current origin.
const ENV_API_BASE = import.meta.env.VITE_API_BASE;
const RUNTIME_BASE =
  ENV_API_BASE && ENV_API_BASE.length > 0
    ? ENV_API_BASE
    : (typeof window !== "undefined" && import.meta.env.PROD ? window.location.origin : "");

// Temporary debug: log what base URL the app is using at runtime
// Remove this after confirming the correct host in production
if (typeof window !== "undefined") {
  console.log("API_BASE at runtime:", RUNTIME_BASE || "(empty)");
}

export function apiFetch(path: string, options?: RequestInit) {
  return fetch(`${RUNTIME_BASE}${path}`, options);
}

