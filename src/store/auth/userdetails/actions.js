import { USER_UPDATE, USER_UPDATED, NOT_UPDATE } from "./actionTypes"

export const isUserUpdated = (user) => {
    return {
        type: USER_UPDATE,
        payload: { user }
    }
}

export const userUpdateSuccess = (user) => {
    return {
        type: USER_UPDATED,
        payload: {user},
    }
}

export const userNotUpdated = (user) => {
    return {
        type: NOT_UPDATE,
        payload: { user }
    }
}