
const API_BASE_URL = "http://localhost:8080/api/swaps";

async function swapRequest(url, options = {}) {
    const token = localStorage.getItem("rewearToken");

    if (!token) {
        throw new Error("Please log in to continue.");
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message || `Request failed (${response.status}).`
        );
    }

    return data;
}

export function createSwap(requestedItemId, offeredItemId) {
    return swapRequest("", {
        method: "POST",
        body: JSON.stringify({ requestedItemId, offeredItemId }),
    });
}

export function getMySwapRequests() {
    return swapRequest("/my-requests");
}

export function getIncomingSwapRequests() {
    return swapRequest("/incoming");
}

export function acceptSwapRequest(id) {
    return swapRequest(`/${id}/accept`, { method: "PATCH" });
}

export function rejectSwapRequest(id) {
    return swapRequest(`/${id}/reject`, { method: "PATCH" });
}
