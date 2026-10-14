import { apiRequest } from "./client";

export function createSwap(requestedItemId, offeredItemId) {
    return apiRequest("/swaps", {
        method: "POST",
        body: JSON.stringify({
            requestedItemId,
            offeredItemId,
        }),
    });
}

export function getMySwapRequests() {
    return apiRequest("/swaps/my-requests");
}

export function getIncomingSwapRequests() {
    return apiRequest("/swaps/incoming");
}

export function acceptSwapRequest(id) {
    return apiRequest(`/swaps/${id}/accept`, {
        method: "PATCH",
    });
}

export function rejectSwapRequest(id) {
    return apiRequest(`/swaps/${id}/reject`, {
        method: "PATCH",
    });
}