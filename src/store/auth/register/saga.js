import { takeEvery, fork, put, all, call } from "redux-saga/effects"
//Account Redux states
import { REGISTER_SILENT, REGISTER_USER, REGISTER_USER_SOCIAL } from "./actionTypes"
import { registerUserSuccessful, registerUserFailed, registerSilentSuccess } from "./actions"
import {
  postJwtRegisterNew,
  postGoogleLogin
} from "../../../helpers/backend_helper"
import { ToastContainer, toast } from 'react-toastify';
import { clearCookiesAndStorage, encrypt, storeLoginTime } from "../../../helpers/api_helper_rs";
import { registerSilent, resendOtp, storeAuthToken, storeUserData } from "../../../pages/Authentication/store/apiServices";
import { CONFIGURATIONS } from "../../../constants/api/api_path";

function* registerUser({ payload: { user, history, signUpType } }) {
  clearCookiesAndStorage()
  try {
    const response = yield call(postJwtRegisterNew, user)
    let info = response?.data?.data
    if(response?.data && !signUpType){
      toast.success(response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT
      });
      // let encInfo = encrypt(JSON.stringify(info))  // in starting we store user token and email in localstorge in encrypted form.
      // localStorage.setItem("jwt", JSON.stringify(encInfo))
      yield history.push({pathname:'/Verification', state:{email: info?.email, token: info?.token}}) // now we will send the token and email in state.
    }
    yield put(registerUserSuccessful(info))
    yield call(resendOtp,info?.token)
  } catch (error) {
    console.log("error", error)
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT
      });
      yield put(registerUserFailed(error?.response?.data?.message[0]))
  }
}

function* registerUserSocial ({ payload: { user, history } }) {
  try{
   const response = yield call(postGoogleLogin,user)
   if(response?.data){
     toast.success(response?.data?.message, {
       position: toast.POSITION.TOP_RIGHT
      });
    storeUserData(response?.data?.data)
    storeAuthToken(response?.data?.data?.token)
    storeLoginTime()
    yield put(registerUserSuccessful(response?.data?.data))
    if(response?.data?.data?.already_register == 0){
      yield call(registerUserSilently)
    }
    // localStorage.setItem(CONFIGURATIONS.BILLING_MODAL, JSON.stringify(CONFIGURATIONS.BILLINGMODAL_TRUE))
    history.push('/dashboard')
   }
 }catch(error){
   toast.error(error?.response?.data?.message, {
     position: toast.POSITION.TOP_RIGHT,
   })
   yield put(registerUserFailed(error?.response?.data?.message))
 }
}

export function* registerUserSilently () {
   let res = yield call(registerSilent)
   if(res?.data?.status_code == 200){
     yield put(registerSilentSuccess(true))
   }
}

export function* watchUserRegister() {
  yield takeEvery(REGISTER_USER, registerUser)
  yield takeEvery(REGISTER_USER_SOCIAL, registerUserSocial)
  yield takeEvery(REGISTER_SILENT, registerUserSilently)
}

function* accountSaga() {
  yield all([fork(watchUserRegister)])
}

export default accountSaga
