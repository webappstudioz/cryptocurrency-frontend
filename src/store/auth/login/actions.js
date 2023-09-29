import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  SOCIAL_LOGIN,
  SEND_OTP,
} from "./actionTypes"

export const loginUser = (user, history, type, invoiceId) => {
  return {
    type: LOGIN_USER,
    payload: { user, history, type, invoiceId },
  }
}

export const sendOtp = (user) => {
  return {
    type: SEND_OTP,
    payload: user
  }
}

export const loginSuccess = user => {
  return {
    type: LOGIN_SUCCESS,
    payload: user?.data?.data,
  }
}

export const logoutUser = history => {
  return {
    type: LOGOUT_USER,
    payload: { history },
  }
}

export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {},
  }
}

export const apiError = error => {
  return {
    type: API_ERROR,
    payload: error,
  }
}

export const socialLogin = (data, history, type, invoiceId) => {
  return {
    type: SOCIAL_LOGIN,
    payload: { data, history, type, invoiceId },
  }
}
