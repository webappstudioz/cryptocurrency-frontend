import {
    ADD_SEARCH,
    REMOVE_SEARCH,
    SEARCH_KEY
  } from "./actionTypes"
  
  export const searchProduct = (search) => {
    return {
      type: ADD_SEARCH,
      payload: { search },
    }
  }
  
  export const searchKey = (search) => {
    return {
      type: SEARCH_KEY,
      payload: { search },
    }
  }

  export const removeSearch = (search) => {
    return {
      type: REMOVE_SEARCH,
      payload: search,
    }
  }
  