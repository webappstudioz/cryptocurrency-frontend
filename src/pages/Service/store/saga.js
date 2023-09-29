// not in use
import { call, put, takeEvery } from "redux-saga/effects"

// Ecommerce Redux States
import {
  // GET_CART_DATA,
  // GET_CUSTOMERS,
  // GET_ORDERS,
  // GET_PRODUCT_DETAIL,
  // GET_PRODUCTS,
  // GET_SHOPS,
  // ADD_NEW_ORDER,
  // DELETE_ORDER,
  // UPDATE_ORDER,
  // ADD_NEW_CUSTOMER,
  // DELETE_CUSTOMER,
  // UPDATE_CUSTOMER,
  GET_SERVICES,
  // GET_CLIENTS,
  GET_CARDS,
  GET_SERVICES_DETAIL,
  GET_HARDWARE_DETAIL,
  GET_IP_LIST,
} from "./actionTypes"
import {
   
  getServicesSuccess,
  getServicesFail,
  getCardsSuccess,
  getCardsFail,
  getServicesDetailSuccess,
  getServicesDetailFail,
  getHardwareDetailSuccess,
  getHardwareDetailFail,
  getIPListSuccess,
  getIPListFail
} from "./actions"

//Include Both Helper File with needed methods
import {
  // getServices,
  // getCards,
  // getServiceDetail,
  // getHardwareDetail,
  // getIPList
} from "./apiService"
 

function* fetchServiceDetail({payload: {config}}) {
  // try {
  //   const response = yield call(getServiceDetail, config)
  //   yield put(getServicesDetailSuccess(response.data))
  // } catch (error) {
  //   yield put(getServicesDetailFail(error))
  // }
}

function* fetchHardwareDetail({payload: {config}}) {
  // try {
  //   const response = yield call(getHardwareDetail, config)
  //   yield put(getHardwareDetailSuccess(response.data))
  // } catch (error) {
  //   yield put(getHardwareDetailFail(error))
  // }
}

function* fetchIPList({payload: {config}}) {
  // try {
  //   const response = yield call(getIPList, config)
  //   yield put(getIPListSuccess(response.data))
  // } catch (error) {
  //   yield put(getIPListFail(error))
  // }
} 

// for live project lwservices
function* fetchServices({payload: {config}}) {
  // try {
  //   const response = yield call(getServices, config)
  //   yield put(getServicesSuccess(response.data))
  // } catch (error) {
  //   yield put(getServicesFail(error))
  // }
}
function* fetchCards({payload: {config}}) {
  // try {
  //   const response = yield call(getCards, config)
  //   yield put(getCardsSuccess(response.data))
  // } catch (error) {
  //   // localStorage.removeItem("authUser")
  //   // history.push("/login")
  //   // window.location.href="/login" //sukhi
  //   yield put(getCardsFail(error))
  // }
}
 

function* ecommerceSaga() {
 
  // for live project
  yield takeEvery(GET_SERVICES, fetchServices)
  yield takeEvery(GET_SERVICES_DETAIL, fetchServiceDetail)
  yield takeEvery(GET_HARDWARE_DETAIL, fetchHardwareDetail)
  yield takeEvery(GET_IP_LIST, fetchIPList)
  
  yield takeEvery(GET_CARDS, fetchCards)
}

export default ecommerceSaga
