import {
  GET_INVOICES,
  GET_INVOICES_FAIL,
  GET_INVOICES_SUCCESS,
  GET_INVOICE_DETAIL,
  GET_INVOICE_DETAIL_FAIL,
  GET_INVOICE_DETAIL_SUCCESS,
  ADD_NEW_INVOICE,
  ADD_INVOICE_SUCCESS,
  ADD_INVOICE_FAIL,
  UPDATE_INVOICE,
  UPDATE_INVOICE_SUCCESS,
  UPDATE_INVOICE_FAIL,
  DELETE_INVOICE,
  DELETE_INVOICE_SUCCESS,
  DELETE_INVOICE_FAIL,

  // for api integration
  GET_INVOICES_LIST,
  GET_INVOICES_LIST_SUCCESS,
  GET_INVOICES_LIST_FAIL,
  GET_TICKET_LIST,
  GET_TICKET_LIST_SUCCESS,
  GET_TICKET_LIST_FAIL
} from "./actionTypes"

export const getInvoices = () => ({
  type: GET_INVOICES,
})

export const getInvoicesSuccess = invoices => ({
  type: GET_INVOICES_SUCCESS,
  payload: invoices,
})

export const getInvoicesFail = error => ({
  type: GET_INVOICES_FAIL,
  payload: error,
})

 

export const addInvoiceSuccess = invoice => ({
  type: ADD_INVOICE_SUCCESS,
  payload: invoice,
})  

export const addInvoiceFail = error => ({
  type: ADD_INVOICE_FAIL,
  payload: error,
})

export const updateInvoice = invoice => ({
  type: UPDATE_INVOICE,
  payload: invoice,
})

export const updateInvoiceSuccess = invoice => ({
  type: UPDATE_INVOICE_SUCCESS,
  payload: invoice,
})

export const updateInvoiceFail = error => ({
  type: UPDATE_INVOICE_FAIL,
  payload: error,
})
 
 

// for live project
export const getInvoicesList = (config) => ({
  type: GET_INVOICES_LIST,
  payload: {config}
})

export const getInvoicesListSuccess = invoices => ({
  type: GET_INVOICES_LIST_SUCCESS,
  payload: invoices,
})

export const getInvoicesListFail = error => ({
  type: GET_INVOICES_FAIL,
  payload: error,
})
// FOR TICKET LIST
export const getTicketList = (config) => ({
  type: GET_TICKET_LIST,
  payload: {config}
})

export const getTicketListSuccess = tickets => ({
  type: GET_TICKET_LIST_SUCCESS,
  payload: tickets,
})

export const getTicketListFail = error => ({
  type: GET_TICKET_LIST_FAIL,
  payload: error,
})