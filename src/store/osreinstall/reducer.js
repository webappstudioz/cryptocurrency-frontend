import { GET_OS ,GET_CP,Get_SERVICE_NAME,Get_PARTITION_MODE} from "./actionTypes"


const INIT_STATE=[]
export const SelectedOs = (state = INIT_STATE, action) => {
  if (action.type == GET_OS) {
    return {
      ...state,
      data: action.data,
    }
  } else return state
}


export const SelectedCp = (state = INIT_STATE, action) => {
  if (action.type == GET_CP) {
    return {
      ...state,
      data: action.data,
    }
  } else return state
}
export const SelectedService = (state = INIT_STATE, action) => {
  if (action.type == Get_SERVICE_NAME) {
    return {
      ...state,
      data: action.data,
    }
  } else return state
}

export const SelectedPartion = (state = INIT_STATE, action) => {
  if (action.type == Get_PARTITION_MODE) {
    return {
      ...state,
      data: action.data,
    }
  } else return state
}