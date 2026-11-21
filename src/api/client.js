// Shared API client for the NorthernStays PHP backend.
//
// The base is relative so requests stay first-party:
//  - production: the app is served from /Hotel/ on the same host as /Hotel/api
//  - development: Vite proxies /Hotel/api to https://coreops.pk (see vite.config.js)
// This keeps the NORTHERNSTAYS_ADMIN session cookie from being treated as a
// third-party cookie, which browsers increasingly block.
export const API_BASE = "/Hotel/api";

// Fired on window when an authenticated endpoint reports the session is gone.
export const AUTH_EXPIRED_EVENT = "ns:auth-expired";

// Endpoints where 401 is an expected answer (wrong password, not logged in yet)
// and must not trigger a global logout redirect.
const AUTH_ENDPOINTS = ["login.php", "forgot_password.php"];

export function apiUrl(path) {
  const value = String(path);
  // Full URLs and site-absolute paths (e.g. `${API_BASE}/rooms.php`) are used as-is;
  // only bare endpoint names like "login.php" get the API base prepended.
  if (/^https?:\/\//i.test(value) || value.startsWith("/")) return value;
  return `${API_BASE}/${value}`;
}

// Parse a JSON API response. When the server sends something else (a PHP
// warning, an HTML error page, an empty proxy error), report the HTTP status
// and the start of the body so the real cause is visible.
export async function readJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    const snippet = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200);
    throw new Error(
      `Server returned an invalid response (HTTP ${response.status}${response.statusText ? " " + response.statusText : ""}): ${snippet || "empty body"}`
    );
  }
}

// Drop-in replacement for fetch() for authenticated admin requests.
// Returns the raw Response so existing callers keep their own parsing.
export async function apiFetch(path, options = {}) {
  const url = apiUrl(path);
  const response = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    ...options,
  });

  if (response.status === 401 && !AUTH_ENDPOINTS.some((name) => url.includes(name))) {
    window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT, { detail: { url } }));
  }

  return response;
}
