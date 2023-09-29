import { takeEvery, put, all, fork, call } from "@redux-saga/core/effects";
import { notificationUpdatedSuccess } from "./action";
import { NOTIFICATION_UPDATE, NOTIFICATION_UPDATED } from "./actionTypes";
import { storeNotifications } from "../../../helpers/api_helper_rs"
import { notificationList } from "../../../pages/Authentication/store/apiServices"

function* getNotifications(action) {
  if(action?.payload?.notification) {
    try{
      let data = new URLSearchParams({
        is_read:"unread"
      })
      let res = yield call(notificationList, data)
      let notifications = res?.data?.data
      // let noti = []
      // for(let i=0; i < notifications?.notifications.length; i++) {
      //   if(noti.length <= 2) {
      //     noti.push(notifications?.notifications[i])
      //   }
      // }
      yield put(notificationUpdatedSuccess(res?.data?.data))
      storeNotifications(res?.data?.data)
    }catch(error){ }
  } else {
    yield put(notificationUpdatedSuccess())
  }
}

export function* watchNotificationUpdate() {
    yield takeEvery(NOTIFICATION_UPDATE, getNotifications)
}

function* notificationSaga() {
    yield all([fork(watchNotificationUpdate)])
}

export default notificationSaga