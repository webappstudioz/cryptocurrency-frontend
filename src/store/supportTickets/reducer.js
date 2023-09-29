import { GET_SUPPORT_TICKETS, REMOVE_SUPPORT_TICKETS } from "./actionTypes";

const intialState = {
  tickets: "",
  fetched: false,
}

const supportTickets = (state = intialState, action) => {
  switch(action.type) {
    case GET_SUPPORT_TICKETS :
        state = {
          ...state,
          tickets: action?.payload?.tickets,
          fetched: true,
        }
        break
      case REMOVE_SUPPORT_TICKETS :
        state = {
          tickets: [],
          fetched: false,
        }
      default: 
        state = {...state}
        break
    }
    return state
}

export default supportTickets