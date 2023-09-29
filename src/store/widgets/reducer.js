import { ADD_CURRENCY, WIDGETS_FETCHED } from "./actionType";

const intialState = {
    servers: "",
    invoices: "",
    tickets: "",
    currentbalnce: "",
    currency: "",
}

const Widgets = (state = intialState, action) => {
    switch(action.type) {
        case WIDGETS_FETCHED: 
            state = {
                ...state,
                servers: action?.payload?.widgets?.servers,
                invoices: action?.payload?.widgets?.invoices,
                tickets: action?.payload?.widgets?.tickets,
                currentbalnce: action?.payload?.widgets?.current_balance,
                currency: action?.payload?.widgets?.currency
            }
            break
        case ADD_CURRENCY: 
            state = {
                ...state,
                currency: action.payload.currency
            }
        default:
            state = {...state}
            break
    }
    return state
}

export default Widgets