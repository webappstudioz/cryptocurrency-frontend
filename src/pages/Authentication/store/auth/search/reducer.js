import {
    ADD_SEARCH,
    REMOVE_SEARCH,
  } from "./actionTypes"
  
  const initialState = {
    search: null,
    loading: false,
  }
  
  const search = (state = initialState, action) => {
    switch (action.type) {
      case ADD_SEARCH:
        state = {
          ...state,
          loading: true,
          registrationError: null,
        }
        break
      case REMOVE_SEARCH:
        state = {
          ...state,
          loading: false,
          user: action.payload,
          registrationError: null,
        }
        break
      default:
        state = { ...state }
        break
    }
    return state
  }
  
  export default search
  