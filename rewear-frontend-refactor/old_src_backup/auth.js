
const API_BASE_URL = "http://localhost:8080/api/auth";

export async function registerUser(userData) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message ||
            Object.values(data.errors || {}).join(", ") ||
            "Registration failed."
        );
    }

    return data;
}

export async function loginUser(credentials) {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message ||
            Object.values(data.errors || {}).join(", ") ||
            "Login failed. Check your email and password."
        );
    }

    return data;
}
