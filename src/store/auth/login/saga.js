import { call, put, takeEvery } from "redux-saga/effects"
import qs from "qs"
// Login Redux States
import { LOGIN_USER, SOCIAL_LOGIN, LOGOUT_USER } from "./actionTypes"
import { apiError, loginSuccess } from "./actions"
import {
  postGoogleLogin,
  postJwtLoginNew,
} from "../../../helpers/backend_helper"
import { bake_cookie, delete_cookie } from "sfcookies"
import { encrypt, clearCookiesAndStorage, storeLoginTime } from "../../../helpers/api_helper_rs"
import { SETTINGS } from "../../../constants/api/api_path"
import { toast } from "react-toastify"
import { storeAuthToken, storeUserData } from "../../../pages/Authentication/store/apiServices"
import { registerUserSilently } from "../register/saga"

function* loginUser({ payload: { user, history, invoiceId } }) {
  storeUserData(user)
  storeAuthToken("sdekmlwkmlmeem")
  // invoiceId? history.push(`/invoice-detail/${invoiceId}`) : 
  user?.role === "Admin"? history.push("/admin/results") : history.push("/dashboard")
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      var data = qs.stringify({
        email: user.email,
        password: user.password,
      })
      let config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
      const response = yield call(postJwtLoginNew, data, config)
      if (response) {
        yield put(loginSuccess(response))
        if (user.rememberMe) {
          let userEnc = encrypt(JSON.stringify(user))
          userEnc? bake_cookie(SETTINGS.COOKIE_KEY, userEnc) : ""
          let userToken = encrypt(JSON.stringify(response.token))
          userToken? bake_cookie(SETTINGS.TOKENKEY, userToken) : ""
        } else if (!user.rememberMe) {
          delete_cookie(SETTINGS.COOKIE_KEY)
          delete_cookie(SETTINGS.TOKENKEY)
        }
        let info = response?.data?.data
        // if(info?.currency){
        //   bake_cookie(SETTINGS.CURRENCY, info?.currency?.id)
        // } 

        if (info?.is_verified === false) {
            toast.success(response?.data?.message, {
              position: toast.POSITION.TOP_RIGHT,
            })
            // let encrytInfo = encrypt(JSON.stringify(info)) // in starting we store user token and email in localstorge in encrypted form.
            // localStorage.setItem("jwt", JSON.stringify(encrytInfo))
            history.push({pathname:'/Verification', state:{email: info?.email, token: info?.token}}) // now we will send the token and email in state.
        } 
        // else if (info?.two_factor) {
        //     // let encInfo = encrypt(JSON.stringify(info?.token))
        //     // localStorage.setItem("jwt", JSON.stringify(encInfo))
        //     toast.success(response?.data?.message, {
        //       position: toast.POSITION.TOP_RIGHT,
        //     })
        //     invoiceId? 
        //     history.push({pathname: "/two-fa", state:{
        //       invoiceId: invoiceId
        //     }}) : 
        //     history.push({pathname: "/two-fa", state:{
        //       token: info?.token
        //     }})
        // } 
        else {
            toast.success(response?.data?.message, {
              position: toast.POSITION.TOP_RIGHT,
            })
            storeLoginTime();
            storeUserData(response?.data?.data)
            storeAuthToken(response?.data?.data?.bearer)
            // invoiceId? history.push(`/invoice-detail/${invoiceId}`) : 
            response?.data?.data?.role === "Admin"? history.push("/admin/results") : history.push("/dashboard")
        }
      }
    }
  } catch (error) {
    toast.error(error?.response?.data?.message, {
      position: toast.POSITION.TOP_RIGHT,
    })
    yield put(apiError(error?.response?.data?.message))
  }
}

function* loginSocial({ payload: { data, history, type, invoiceId } }) {
  try {
    const response = yield call(postGoogleLogin, data)
    if (response?.data) {
      toast.success(response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
      storeUserData(response?.data?.data)
      storeAuthToken(response?.data?.data?.token)
      storeLoginTime()
      yield put(loginSuccess(response?.data?.data))
      if(response?.data?.data?.already_register == 0){
        yield call(registerUserSilently)
      }
      // let res = yield call(registerUserSilently) .
      invoiceId? history.push(`/invoice-detail/${invoiceId}`) : history.push("/dashboard")
    }
  } catch (error) {
    toast.error(error?.response?.data?.message, {
      position: toast.POSITION.TOP_RIGHT,
    })
    yield put(apiError(error))
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    clearCookiesAndStorage()
    history.push("/login")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser)
  yield takeEvery(SOCIAL_LOGIN, loginSocial)
  yield takeEvery(LOGOUT_USER, logoutUser)
}

export default authSaga
