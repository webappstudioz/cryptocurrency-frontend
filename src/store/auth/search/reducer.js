import { ADD_SEARCH, REMOVE_SEARCH, SEARCH_KEY } from "./actionTypes"

const initialState = {
  search: null,
  loading: false,
}

const search = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_KEY:
      state = {
        ...state,
        loading: true,
        search: action.payload,
      }
      break
    case REMOVE_SEARCH:
      state = {
        ...state,
        loading: false,
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default search
