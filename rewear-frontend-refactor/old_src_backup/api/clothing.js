import { apiRequest } from "./client";

export function getClothing() {
    return apiRequest("/clothing");
}

export function getMyListings() {
    return apiRequest("/clothing/my-listings");
}

export function createClothing(clothingData) {
    return apiRequest("/clothing", {
        method: "POST",
        body: JSON.stringify(clothingData),
    });
}

export function updateClothing(id, clothingData) {
    return apiRequest(`/clothing/${id}`, {
        method: "PUT",
        body: JSON.stringify(clothingData),
    });
}

export function deleteClothing(id) {
    return apiRequest(`/clothing/${id}`, {
        method: "DELETE",
    });
}