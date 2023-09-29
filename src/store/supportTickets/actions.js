import { GET_SUPPORT_TICKETS, REMOVE_SUPPORT_TICKETS } from "./actionTypes";

export const isSupportTicketsFetched = (tickets) => {
  return {
    type: GET_SUPPORT_TICKETS,
    payload: { tickets }
  }
}

export const removeSupportTickets = () => {
  return {
    type: REMOVE_SUPPORT_TICKETS,
    payload: { }
  }

}
