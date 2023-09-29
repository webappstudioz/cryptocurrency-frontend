import { all, fork } from "redux-saga/effects"

//public
import AccountSaga from "./auth/register/saga"
import SearchSaga from "./auth/search/saga"
import AuthSaga from "./auth/login/saga"
import ForgetSaga from "./auth/forgetpwd/saga"
import LayoutSaga from "./layout/saga"
// import ecommerceSaga from "./e-commerce/saga"
// import serviceSaga from "../pages/Service/store/saga"
// import invoicesSaga from "./invoices/saga"
import userDetailSaga from "./auth/userdetails/saga"
import notificationSaga from "./auth/notification/saga"
import savedCardsSaga from "./savedcards/saga"
import serviceSaga from "./services/saga"
export default function* rootSaga() {
  yield all([
    //public
    AccountSaga(),
    fork(AuthSaga),
    ForgetSaga(),
    fork(LayoutSaga),
    // fork(ecommerceSaga),
    // fork(invoicesSaga),
    SearchSaga(),
    userDetailSaga(),
    notificationSaga(),
    savedCardsSaga(),
    serviceSaga()
  ])
}
