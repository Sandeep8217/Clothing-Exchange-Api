import { apiRequest } from "./client";

export function getAdminDashboardStats() {
    return apiRequest("/admin/dashboard");
}

export function getAdminUsers() {
    return apiRequest("/admin/users");
}

export function updateAdminUserStatus(userId, active) {
    const query = new URLSearchParams({
        active: String(active),
    });

    return apiRequest(
        `/admin/users/${encodeURIComponent(userId)}/status?${query.toString()}`,
{
    method: "PATCH",
}
);
}

export function getAdminListings() {
    return apiRequest("/admin/listings");
}

export function deleteAdminListing(listingId) {
    return apiRequest(
        `/admin/listings/${encodeURIComponent(listingId)}`,
        {
            method: "DELETE",
        }
    );
}
export function getAdminAnalyticsSummary() {
    return apiRequest("/admin/analytics/summary");
}


export function getAdminActivityLogs() {
    return apiRequest("/admin/activity-logs");
}