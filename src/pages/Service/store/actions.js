import {
  // for live project
  GET_SERVICES,
  GET_SERVICES_SUCCESS,
  GET_SERVICES_FAIL,
  GET_CARDS,
  GET_CARDS_SUCCESS,
  GET_CARDS_FAIL,
  GET_SERVICES_DETAIL,
  GET_SERVICES_DETAIL_SUCCESS,
  GET_SERVICES_DETAIL_FAIL,
  GET_HARDWARE_DETAIL,
  GET_HARDWARE_DETAIL_SUCCESS,
  GET_HARDWARE_DETAIL_FAIL,
  GET_IP_LIST,
  GET_IP_LIST_SUCCESS,
  GET_IP_LIST_FAIL
} from "./actionTypes"

//not in use
// for live project lwservices
export const getServices = (config) => ({
  type: GET_SERVICES,
  payload: { config }
})

export const getServicesSuccess = customers => ({
  type: GET_SERVICES_SUCCESS,
  payload: customers,
})

export const getServicesFail = error => ({
  type: GET_SERVICES_FAIL,
  payload: error,
})

export const getServiceDetail = (config) => {
  return ({
    type: GET_SERVICES_DETAIL,
    payload: { config }
  })
}

export const getServicesDetailSuccess = details => {
  return ({
    type: GET_SERVICES_DETAIL_SUCCESS,
    payload: details,
  })
}

export const getServicesDetailFail = error => ({
  type: GET_SERVICES_DETAIL_FAIL,
  payload: error,
})

// get service hardware detail
export const getHardwareDetail = (data) => {
  return ({
    type: GET_HARDWARE_DETAIL,
    payload: data
  })
}

export const getHardwareDetailSuccess = details => {
  return ({
    type: GET_HARDWARE_DETAIL_SUCCESS,
    payload: details,
  })
}

export const getHardwareDetailFail = error => ({
  type: GET_HARDWARE_DETAIL_FAIL,
  payload: error,
})

export const getIPList = (config) => ({
  type: GET_IP_LIST,
  payload: { config }
})



export const getIPListSuccess = customers => ({
  type: GET_IP_LIST_SUCCESS,
  payload: customers,
})

export const getIPListFail = error => ({
  type: GET_IP_LIST_FAIL,
  payload: error,
})

export const getCards = (config) => ({
  type: GET_CARDS,
  payload: { config }
})

export const getCardsSuccess = cards => ({
  type: GET_CARDS_SUCCESS,
  payload: cards,
})

export const getCardsFail = error => ({
  type: GET_CARDS_FAIL,
  payload: error,
}) 