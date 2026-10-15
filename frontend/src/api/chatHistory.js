
import { apiRequest } from "./client";

export function getChatHistory(swapRequestId) {
    return apiRequest(
        `/swaps/${encodeURIComponent(swapRequestId)}/messages`
    );
}

export function markMessagesAsRead(swapRequestId) {
    return apiRequest(
        `/swaps/${encodeURIComponent(swapRequestId)}/messages/read`,
        { method: "POST" }
    );
}

export function getUnreadMessageCount() {
    return apiRequest("/swaps/messages/unread-count");
}
