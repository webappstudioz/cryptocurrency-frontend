import {
    ADD_SEARCH,
    REMOVE_SEARCH,
  } from "./actionTypes"
  
  export const searchProduct = (search) => {
    return {
      type: ADD_SEARCH,
      payload: { search },
    }
  }
  
  export const removeSearch = user => {
    return {
      type: REMOVE_SEARCH,
      // payload: user,
    }
  }
  