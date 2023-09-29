import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  SOCIAL_LOGIN,
  // SEND_OTP,
} from "./actionTypes"

const initialState = {
  error: "",
  user:"",
  loading: "",
  spinner: ""
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        spinner: true,
      }
      break
    case SOCIAL_LOGIN:
      state = {
        ...state,
        loading: true,
      }
      break 
    // case SEND_OTP: {
    //   state = {
    //     ...state,
    //     loading: false
    //   }
    // }
    case LOGIN_SUCCESS:
      state = {
        ...state,
        user:action.payload,
        loading: false,
        spinner: false
      }
      break
    case LOGOUT_USER:
      state = { 
        ...state,
        loading: "",
        spinner: "",
       }
      break
    case LOGOUT_USER_SUCCESS:
      state = {
         ...state,
        loading: "",
        spinner: "", }
      break
    case API_ERROR:
      state = { 
        ...state, 
        error: action.payload, 
        loading: false,
        spinner: false
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default login
