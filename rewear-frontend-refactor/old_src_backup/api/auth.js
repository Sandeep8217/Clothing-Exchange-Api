import { apiRequest } from "./client";

export function registerUser(userData) {
    return apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
}

export function loginUser(credentials) {
    return apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    });
}