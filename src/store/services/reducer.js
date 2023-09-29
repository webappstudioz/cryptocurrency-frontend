import { ALLSERVICESSYNC, ALLSERVICESSYNCSUCCESS, GET_SERVICES, REMOVE_SERVICES, SERVICESYNCED, SYNCSERVICESILENT } from "./actionTypes";

const intialState = {
  services: "",
  call:"",
  fetched: false,
  loader: true,
  syncStatus: 0, 
  allServiceSync: false
}

const services = (state = intialState, action) => {
    switch(action.type) {
      case GET_SERVICES :
        state = {
          ...state,
          services: action?.payload?.services,
          call:action?.payload?.call,
          fetched: true,
          loader: false
        }
        break
      case SYNCSERVICESILENT : 
        state = {
          ...state,
          syncStatus: false,
        }
        break
      case SERVICESYNCED : 
        state = {
          ...state,
          syncStatus: true,
        }
        break
      case ALLSERVICESSYNC :
        state = {
          ...state,
          allServiceSync: false
        }
        break
      case ALLSERVICESSYNCSUCCESS :
        state={
          ...state,
          allServiceSync: true
        }
        break
      case REMOVE_SERVICES :
        state = {
          services: [],
          call:"",
          fetched: false,
          syncStatus: 0, 
          allServiceSync: false
        }
        break
      default: 
        state = {...state}
        break
    }
    return state
}

export default services