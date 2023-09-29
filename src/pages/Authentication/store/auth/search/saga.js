import { takeEvery, fork, put, all, call } from "redux-saga/effects"

//Account Redux states
import { ADD_SEARCH } from "./actionTypes"
import { registerUserSuccessful, registerUserFailed } from "./actions"

import {
  postJwtRegister,
} from "../../../helpers/backend_helper"


// Is user register successfull then direct plot user in redux.
function* searchProd({payload: { search }}) {
//   try {
//     if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
//       const response = yield call(postJwtRegister, "/api/register", user)
//       yield put(registerUserSuccessful(response))
//       history.push('/email-verify')
//     } 
//   } catch (error) {
//     yield put(registerUserFailed(error))
//   }
}

export function* watchUserSearch() {
  yield takeEvery(ADD_SEARCH, searchProd)
}

function* searchSaga() {
  yield all([fork(watchUserSearch)])
}

export default searchSaga
