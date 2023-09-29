import { takeEvery, put, all, fork, call } from "@redux-saga/core/effects";
import { GET_CARDS, CARDS_FETCHED } from "./actionType";
import { getSavedCards } from "../../pages/Service/store/apiService"
import { cardsFetched } from "./action";
import { storeCards } from "../../helpers/api_helper_rs";

function* getSavedCardsList() {
    try{
        let res = yield call(getSavedCards)
        yield put(cardsFetched(res?.data?.data))
        storeCards(res?.data?.data)
    }catch(error){  }
}

export function* watchCards() {
    yield takeEvery(GET_CARDS, getSavedCardsList)
}

function* savedCardsSaga() {
    yield all([fork(watchCards)])
}
export default savedCardsSaga