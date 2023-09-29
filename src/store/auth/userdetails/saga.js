import { takeEvery, put, all, fork } from "@redux-saga/core/effects";
import { userUpdateSuccess } from "./actions"
import { USER_UPDATE } from "./actionTypes";

function* userUpdateFunc({payload: { user }}) {
    yield put(userUpdateSuccess(user))
}

export function* watchUserUpdate() {
    yield takeEvery(USER_UPDATE, userUpdateFunc)
}

function* userDetailSaga() {
    yield all([fork(watchUserUpdate)])
}

export default userDetailSaga