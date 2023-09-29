import { NOT_UPDATE, USER_UPDATE, USER_UPDATED } from "./actionTypes"

const intialState = {
    user:"",
    detailUpdated: false
}

const userupdate = (state = intialState, action) => {
    switch(action.type) {
        case USER_UPDATED :
            state = {
                ...state,
                user:action.payload,
                detailUpdated: true
            }
            break
        case NOT_UPDATE :
            state = {
                user:"",
                detailUpdated: false
            }
            break
        default:
            state = { ...state }
            break
    }
    return state
}

export default userupdate