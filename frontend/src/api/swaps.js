import {apiRequest} from "./client";

export function createSwap(requestedItemId, offeredItemId) {
    return apiRequest("/swaps",
        {
            method: "POST",
            body: JSON.stringify({requestedItemId, offeredItemId})
        });
}

export const getMySwapRequests = () =>
    apiRequest("/swaps/my-requests");

export const getIncomingSwapRequests = () =>
    apiRequest("/swaps/incoming");

export const acceptSwapRequest = (id) =>
    apiRequest(`/swaps/${id}/accept`,
        {method: "PATCH"});

export const rejectSwapRequest = (id) =>
    apiRequest(`/swaps/${id}/reject`,
        {method: "PATCH"});


export function confirmSwapCompletion(swapId) {
    return apiRequest(
        `/swaps/${encodeURIComponent(swapId)}/confirm-completion`,
        { method: "PATCH" }
    );
}