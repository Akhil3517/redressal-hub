export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.toString() || "http://localhost:5000";
async function request(path, method, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return await res.json();
}
export const api = {
  get: path => request(path, "GET"),
  post: (path, body) => request(path, "POST", body)
};