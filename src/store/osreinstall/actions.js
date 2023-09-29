import {
  GET_OS,
  Get_PARTITION_MODE,
  GET_CP,
  Get_SERVICE_NAME,
} from "./actionTypes"

export const getOs = (data) => {
    return {
      type: GET_OS,
      data: data,
    }
}
export const getCp = data => {
  return {
    type: GET_CP,
    data: data,
  }
}
export const getServiceName = data => {
  return {
    type: Get_SERVICE_NAME,
    data: data,
  }
}
export const getPartionmode = data => {
  return {
    type: Get_PARTITION_MODE,
    data: data,
  }
}
