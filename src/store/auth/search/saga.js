import { takeEvery, fork, put, all, call } from "redux-saga/effects"

//Account Redux states
import { ADD_SEARCH } from "./actionTypes"
import { searchKey } from "./actions"

import {
  postJwtRegister,
} from "../../../helpers/backend_helper"


// Is user register successfull then direct plot user in redux.
function* searchProduct({payload: { search }}) {
  yield put(searchKey(search))
}

export function* watchUserSearch() {
  yield takeEvery(ADD_SEARCH, searchProduct)
}

function* SearchSaga() {
  yield all([fork(watchUserSearch)])
}

export default SearchSaga
