import { GET_SERVICES, REMOVE_SERVICES, SYNCSERVICESILENT, SERVICESYNCED, ALLSERVICESSYNC, ALLSERVICESSYNCSUCCESS } from "./actionTypes";

export const isServicesFetched = (services, call) => {
  return {
    type: GET_SERVICES,
    payload: {services, call}
  }
}

export const syncServiceSilent = (serviceId) => {
  return {
    type: SYNCSERVICESILENT,
    payload: {serviceId}
  }
}

export const serviceSynced = () => {
  return {
    type: SERVICESYNCED
  }
}

export const allServicesSync = () => {
  return {
    type: ALLSERVICESSYNC
  }
}

export const allServicesSyncSuccess = () => {
  return {
    type: ALLSERVICESSYNCSUCCESS
  }
}

export const removeServices = (services) => {
  return {
    type: REMOVE_SERVICES,
    payload: {services}
  }

}
