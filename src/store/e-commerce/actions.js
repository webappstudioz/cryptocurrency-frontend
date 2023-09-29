import {
 
  GET_PRODUCTS,
  GET_PRODUCTS_FAIL,
  GET_PRODUCTS_SUCCESS,
  GET_CUSTOMERS,
  GET_CUSTOMERS_FAIL,
  GET_CUSTOMERS_SUCCESS,
  ADD_NEW_CUSTOMER,
  ADD_CUSTOMER_SUCCESS,
  ADD_CUSTOMER_FAIL,
  UPDATE_CUSTOMER,
  UPDATE_CUSTOMER_SUCCESS,
  UPDATE_CUSTOMER_FAIL,
  DELETE_CUSTOMER,
  DELETE_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_FAIL,
  GET_SHOPS,
  GET_SHOPS_FAIL,
  GET_SHOPS_SUCCESS,
  GET_PRODUCT_DETAIL,
  GET_PRODUCT_DETAIL_FAIL,
  GET_PRODUCT_DETAIL_SUCCESS,

  // for live project
  GET_SERVICES,
  GET_SERVICES_SUCCESS,
  GET_SERVICES_FAIL,
  GET_CLIENTS,
  GET_CLIENTS_SUCCESS,
  GET_CLIENTS_FAIL,
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

 
 

export const addCustomerSuccess = customer => ({
  type: ADD_CUSTOMER_SUCCESS,
  payload: customer,
})

export const addCustomerFail = error => ({
  type: ADD_CUSTOMER_FAIL,
  payload: error,
})

export const updateCustomer = customer => ({
  type: UPDATE_CUSTOMER,
  payload: customer,
})

export const updateCustomerSuccess = customer => ({
  type: UPDATE_CUSTOMER_SUCCESS,
  payload: customer,
})

export const updateCustomerFail = error => ({
  type: UPDATE_CUSTOMER_FAIL,
  payload: error,
})
 

export const getShops = () => ({
  type: GET_SHOPS,
})

export const getShopsSuccess = shops => ({
  type: GET_SHOPS_SUCCESS,
  payload: shops,
})

export const getShopsFail = error => ({
  type: GET_SHOPS_FAIL,
  payload: error,
})

// for live project lwservices
export const getServices = (config) => ({
  type: GET_SERVICES,
  payload: {config}
})

export const getProductlist = list => {
  return ({
    type: GET_PRODUCTS,
    payload: list,
  })
}
export const getServicesSuccess = customers => {
 return({
  type: GET_SERVICES_SUCCESS,
  payload: customers,
 }) 
}

export const getServicesFail = error => ({
  type: GET_SERVICES_FAIL,
  payload: error,
})

// export const getServiceDetail = (config) => {
//   return ({
//     type: GET_SERVICES_DETAIL,
//     payload: {config}
//   })
// }

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
// export const getHardwareDetail = (config) => {

//   return ({
//     type: GET_HARDWARE_DETAIL,
//     payload: {config}
//   })
// }

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

// export const getIPList = (config) => ({
//   type: GET_IP_LIST,
//   payload: {config}
// })

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
  payload: {config}
})

export const getCardsSuccess = cards => ({
  type: GET_CARDS_SUCCESS,
  payload: cards,
})

export const getCardsFail = error => ({
  type: GET_CARDS_FAIL,
  payload: error,
})

// for clients list
export const getClients = (config) => ({
  type: GET_CLIENTS,
  payload: {config}
})

export const getClientsSuccess = customers => ({
  type: GET_CLIENTS_SUCCESS,
  payload: customers,
})

export const getClietsFail = error => ({
  type: GET_CLIENTS_FAIL,
  payload: error,
})

