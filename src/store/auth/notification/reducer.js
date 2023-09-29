import { NOTIFICATION_UPDATE, NOTIFICATION_UPDATED, REMOVE_NOTIFICATIONS } from "./actionTypes";

const intialState = {
    notifications: "",
    updated : false
}

const notificationUpdate = (state = intialState, action) => {
    switch(action.type) {
        case NOTIFICATION_UPDATED : 
            state = {
                ...state,
                notifications: action?.payload?.notification,
                updated: true
            }
            break
        case REMOVE_NOTIFICATIONS : 
            state = {
                notifications: [],
                updated: false
            }
        default:
            state = { ...state }
            break
    }
    return state
}

export default notificationUpdate