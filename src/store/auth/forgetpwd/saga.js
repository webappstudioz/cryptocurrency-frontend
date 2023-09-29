import { takeEvery, fork, put, all, call } from "redux-saga/effects"

// Login Redux States
import { FORGET_PASSWORD } from "./actionTypes"
import { userForgetPasswordSuccess, userForgetPasswordError } from "./actions"
import { ToastContainer, toast } from 'react-toastify';
import {
  postJwtForgetPwdNew,
} from "../../../helpers/backend_helper"


//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* forgetUser({ payload: { user, history } }) {
  try {
    let data = new URLSearchParams({
      email: user.email
    })
    const response = yield call(postJwtForgetPwdNew, data)
    if (response) {
       toast.success(response?.data?.message, {
         position: toast.POSITION.TOP_RIGHT
       });
      yield put(
        userForgetPasswordSuccess(
          response?.data?.message
        )
      )
    }    
  } catch (error) {
    toast.error(error?.response?.data?.message, {
      position: toast.POSITION.TOP_RIGHT
    });
    yield put(userForgetPasswordError(error?.response?.data?.message))
  }
}

export function* watchUserPasswordForget() {
  yield takeEvery(FORGET_PASSWORD, forgetUser)
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)])
}

export default forgetPasswordSaga
