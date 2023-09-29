import { takeEvery, fork, put, all, call } from "redux-saga/effects"
import { ALLSERVICESSYNC, SYNCSERVICESILENT } from "./actionTypes"
import { syncAllServices, syncService } from "../../pages/Service/store/apiService"
import { allServicesSyncSuccess, serviceSynced } from "./actions"
import { storeArrayFuc } from "../../helpers/api_helper_rs"

function* syncServiceSilentHit({ payload: {serviceId}}) {
    try{
    let data = new URLSearchParams({
        service_id:serviceId
    })
    const res = yield call(syncService,data)
    let info =  res?.data?.data
    if(info){
        info?.map((list) => {
            storeArrayFuc(list?.service_id, list?.uuid, list?.status)
        })
        yield put(serviceSynced())
     }
    }catch(error) {
    }
}

function* sycnAllServiceSilent(){
    try{
        let res = yield call(syncAllServices)
        yield put(allServicesSyncSuccess())
    }catch(error){
    }
}

export function* watchServiceSync() {
    yield takeEvery(SYNCSERVICESILENT, syncServiceSilentHit)
    yield takeEvery(ALLSERVICESSYNC, sycnAllServiceSilent)
}

function* serviceSaga(){
    yield all([fork(watchServiceSync)])
}
export default serviceSaga