import {
  REGISTER_USER,
  REGISTER_USER_SUCCESSFUL,
  REGISTER_USER_FAILED,
  REGISTER_USER_SOCIAL,
  REMOVE_USER_DETAIL,
  REGISTER_SILENT,
  REGISTER_SILENT_SUCCESS,
} from "./actionTypes"

const initialState = {
  registrationError: null,
  message: null,
  loading: false,
  spinner: false,
  user: null,
  user_registerd: "",
}

const account = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER:
      state = {
        ...state,
        spinner: true,
        registrationError: null,
      }
      break
    case REGISTER_USER_SOCIAL:
      state = {
        ...state,
        loading: true,
        registrationError: null,
      }
      break
    case REGISTER_USER_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        spinner: false,
        user: action.payload,
        registrationError: null,
      }
      break
    case REGISTER_USER_FAILED:
      state = {
        ...state,
        user: null,
        loading: false,
        spinner: false,
        registrationError: action.payload,
      }
      break
    case REGISTER_SILENT:
      state = {
        ...state,
        user_registerd: "under_process"
      }
      break
    case REGISTER_SILENT_SUCCESS: 
      state = {
        ...state,
        user_registerd: action.payload,
      }
      break
    case REMOVE_USER_DETAIL: 
      state = {
        ...state,
        user: null,
        loading: false,
        spinner: false,
        registrationError: null,
      }
    default:
      state = { ...state }
      break
  }
  return state
}

export default account
