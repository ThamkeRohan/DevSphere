import { makeRequest } from "./makeRequest";

export function getNotifications() {
    return makeRequest('notifications', {
        method: "GET"
    })
}

export function markNotificationAsRead({notificationId}) {
    return makeRequest(`notifications/${notificationId}/markNotificationAsRead`, {
        method: "PATCH"
    })
}