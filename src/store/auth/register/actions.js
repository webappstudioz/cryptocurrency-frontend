import {
  REGISTER_USER,
  REGISTER_USER_SUCCESSFUL,
  REGISTER_USER_FAILED,
  REGISTER_USER_SOCIAL,
  REMOVE_USER_DETAIL,
  REGISTER_SILENT,
  REGISTER_SILENT_SUCCESS
} from "./actionTypes"

export const registerUser = (user, history, signUpType) => {
  return {
    type: REGISTER_USER,
    payload: { user, history, signUpType },
  }
}

export const registerSocial = (user, history)=>{
  return {
    type:REGISTER_USER_SOCIAL,
    payload:{user, history}
  }
}

export const registerUserSuccessful = user => {
  return {
    type: REGISTER_USER_SUCCESSFUL,
    payload: user,
  }
}

export const registerUserFailed = user => {
  return {
    type: REGISTER_USER_FAILED,
    payload: user,
  }
}

export const removeUserDetail = () => {
  return {
    type: REMOVE_USER_DETAIL,
    payload: ""
  }
}

export const registerSilentUser = () => {
  return {
    type: REGISTER_SILENT
  }
}

export const registerSilentSuccess = (result) => {
  return {
    type: REGISTER_SILENT_SUCCESS,
    payload: result
  }
}