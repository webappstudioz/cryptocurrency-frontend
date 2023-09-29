import { PRODUCT, OVERVIEW, USAGE } from "./actionType";

const initialState = {
    overview: "",
    usage: "",
    cancelRequest: false,
    osReinstallRequest: false,
    rescuePendingRequest: false,
    loader: true,
    fetched: false
}

const SelectedServiceProduct = (state = initialState, action) => {
    switch(action.type){
        case OVERVIEW :
            state = {
                ...state,
                overview: action?.payload?.product,
                loader: false,
                fetched: true,
            }
            break
        }
        return state
}

export default SelectedServiceProduct;