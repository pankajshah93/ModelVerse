const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ||
  "http://localhost:5000";

export async function apiFetch(path, { token, ...options } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,

    // IMPORTANT: send and receive backend cookies
    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}

export { API_BASE };