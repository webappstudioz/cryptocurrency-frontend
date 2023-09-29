import { FETCHED_SERVICES, REMOVE_FETCHED_SERVICES } from "./actionType";

const intialState = {
    services: "",
}

const fetchServices =(state = intialState, action) => {
    switch(action.type) {
        case FETCHED_SERVICES: 
            state = {
                ...state,
                services: action?.payload?.services
            }
            break
        case REMOVE_FETCHED_SERVICES: 
            state = {
                services: []
            }
            break
        default:
            state={...state}
            break 
    }
    return state
}

export default fetchServices