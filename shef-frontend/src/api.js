export function getToken() {
  return localStorage.getItem("sm_token") || "";
}
export function setToken(token) {
  localStorage.setItem("sm_token", token);
}
export function clearToken() {
  localStorage.removeItem("sm_token");
}

export async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await const API_PREFIX = import.meta.env.VITE_API_PREFIX || '';

  const res = await fetch(`${API_PREFIX}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}
