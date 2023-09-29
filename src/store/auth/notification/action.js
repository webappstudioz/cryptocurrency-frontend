import { NOTIFICATION_UPDATE ,NOTIFICATION_UPDATED, REMOVE_NOTIFICATIONS } from "./actionTypes";

export const isNotificationUpdated = (notification) => {
    return {
        type: NOTIFICATION_UPDATE,
        payload: {notification}
    }
}

export const notificationUpdatedSuccess = (notification) => {
    return {
        type: NOTIFICATION_UPDATED,
        payload: {notification}
    }
}

export const removeNotifications = (notification) => {
    return {
        type: REMOVE_NOTIFICATIONS,
        payload: {notification}
    }
}