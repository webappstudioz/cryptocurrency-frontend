import { GET_LIST_OS, OS_LIST_FETCHED } from "./actionType";

const intialState = {
   hit:false
}

const OSInstallationList = (state = intialState, action) => {
    switch(action.type) {
        case GET_LIST_OS: 
        state = {
            ...state,
            hit:true
        }
        break
        case OS_LIST_FETCHED: 
        state = {
            ...state,
            hit:false
        }
        break
        default:
            state = {...state}
            break
    }
    return state
}

export default OSInstallationList