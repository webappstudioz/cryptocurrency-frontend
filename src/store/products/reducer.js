import { 
    INSTANT_PRODUCTS, 
    INSTANT_SALE,
    INSTANT_NEWEST,
    INSTANT_LOW_TO_HOGH,
    INSTANT_HIGH_TO_LOW,
    CUSTOM_PRODUCTS, 
    CUSTOM_SALE, 
    CUSTOM_NEWEST,
    CUSTOM_LOW_TO_HOGH,
    CUSTOM_HIGH_TO_LOW,
    REMOVE_PRODUCTS, 
    ADD_CURRENCY
} from "./actionType";

const initialState = {
    instantProducts: "",
    instantSale: "",
    instantNewest:"",
    instantLowHigh:"",
    instantHighLow:"",
    customProducts: "",
    customSale: "",
    customNewest:"",
    customLowHigh:"",
    customHighLow:"",
    currency: "",
    fetched: false,
    loader: true,
  }

const products = (state = initialState, action) => {
    switch(action.type){
        case INSTANT_PRODUCTS :
            state = {
                ...state,
                instantProducts: action?.payload?.products?.products,
                currency: action?.payload?.products?.currency,
                fetched: true,
                loader: false
            }
            break
        case INSTANT_SALE : 
            state = {
                ...state,
                instantSale: action?.payload?.products?.products,
                currency: action?.payload?.products?.currency,
                fetched: true,
                loader: false
            }
            break
        case INSTANT_NEWEST : 
            state = {
                ...state,
                instantNewest: action?.payload?.products?.products,
                currency: action?.payload?.products?.currency,
                fetched: true,
                loader: false
            }
            break
        case INSTANT_LOW_TO_HOGH : 
            state = {
                ...state,
                instantLowHigh: action?.payload?.products?.products,
                currency: action?.payload?.products?.currency,
                fetched: true,
                loader: false
            }
            break
        case INSTANT_HIGH_TO_LOW : 
            state = {
                ...state,
                instantHighLow: action?.payload?.products?.products,
                currency: action?.payload?.products?.currency,
                fetched: true,
                loader: false
            }
            break
        case CUSTOM_PRODUCTS :
            state = {
                ...state,
                customProducts: action?.payload?.products?.products,
                currency: action?.payload?.products?.currency,
                fetched: true,
                loader: false
            }
            break        
        case CUSTOM_SALE : 
            state = {
                ...state,
                customSale: action?.payload?.products?.products,
                currency: action?.payload?.products?.currency,
                fetched: true,
                loader: false
            }
            break
        case CUSTOM_NEWEST : 
            state = {
                ...state,
                customNewest: action?.payload?.products?.products,
                currency: action?.payload?.products?.currency,
                fetched: true,
                loader: false
            }
            break
        case CUSTOM_LOW_TO_HOGH : 
            state = {
                ...state,
                customLowHigh: action?.payload?.products?.products,
                currency: action?.payload?.products?.currency,
                fetched: true,
                loader: false
            }
            break
        case CUSTOM_HIGH_TO_LOW : 
            state = {
                ...state,
                customHighLow: action?.payload?.products?.products,
                currency: action?.payload?.products?.currency,
                fetched: true,
                loader: false
            }
            break
        case ADD_CURRENCY: 
            state = {
                ...state,
                currency: action.payload.currency
            }
            break
        case REMOVE_PRODUCTS :
            state = {
                instantProducts: "",
                customProducts: "",
                currency: "",
                fetched: false,
                loader: false
            }
            break
        default: 
            state = {...state}
            break
    }
    return state
}

export default products