
import { apiRequest } from "./client";

export function getProfile() {
    return apiRequest("/profile");
}

export function updateProfile(profileData) {
    return apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
    });
}
