const API_BASE_URL = "http://localhost:8080/api";

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("rewearToken");
    const headers = {
        ...(options.body ? {"Content-Type": "application/json"} : {}),
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
        ...options.headers,
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {...options, headers});
    if (response.status === 204) return null;
    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json") ? await response.json() : await response.text();
    if (!response.ok) {
        const message = typeof data === "object" && data !== null ? data.message || `Request failed (${response.status})` : data || `Request failed (${response.status})`;
        throw new Error(message);
    }
    return data;
}
