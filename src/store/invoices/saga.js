import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {  
  GET_INVOICES_LIST,
  GET_TICKET_LIST
 } from "./actionTypes"
import {
  
 
  getInvoicesListSuccess,
  getInvoicesListFail,
  getTicketListSuccess,
  getTicketListFail
} from "./actions"

//Include Both Helper File with needed methods
// import { 
  // for api integration
  // getInvoicesList,
  // getTicketList
//  } from "../../helpers/backend_helper"

 
// for api integration
// function* fetchInvoicesList({payload: {config}}) {
  // try {
  //   const response = yield call(getInvoicesList, config)
  //   yield put(getInvoicesListSuccess(response.data))
  // } catch (error) {
  //   yield put(getInvoicesListFail(error))
  // }
// }
// for ticket list
// function* fetchTicketList({payload: {config}}) {
  // try {
  //   const response = yield call(getTicketList, config)
  //   yield put(getTicketListSuccess(response))
  // } catch (error) {
  //   yield put(getTicketListFail(error))
  // }
// }

 
 

 

function* invoiceSaga() {
  // for api integration
  // yield takeEvery(GET_INVOICES_LIST, fetchInvoicesList)
  // yield takeEvery(GET_TICKET_LIST, fetchTicketList)
}

export default invoiceSaga
