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

export const isInstantProductsFetched = (products) => {
    return {
        type: INSTANT_PRODUCTS,
        payload: {products}
    }
}

export const instantSaleFetched = (products) => {
    return{
        type: INSTANT_SALE,
        payload: {products}
    }
}

export const instantNewestFetched = (products) => {
    return{
        type: INSTANT_NEWEST,
        payload: {products}
    }
}

export const instantLowHighFetched = (products) => {
    return{
        type: INSTANT_LOW_TO_HOGH,
        payload: {products}
    }
}

export const instantHighLowFetched = (products) => {
    return{
        type: INSTANT_HIGH_TO_LOW,
        payload: {products}
    }
}

export const isCustomProductsFetched = (products) => {
    return {
        type: CUSTOM_PRODUCTS,
        payload: {products}
    }
}

export const customSaleFetched = (products) => {
    return {
        type: CUSTOM_SALE,
        payload: { products }
    }
}

export const customNewestFetched = (products) => {
    return{
        type: CUSTOM_NEWEST,
        payload: {products}
    }
}

export const customLowHighFetched = (products) => {
    return{
        type: CUSTOM_LOW_TO_HOGH,
        payload: {products}
    }
}

export const customHighLowFetched = (products) => {
    return{
        type: CUSTOM_HIGH_TO_LOW,
        payload: {products}
    }
}

export const removeProducts = (products) => {
    return {
        type: REMOVE_PRODUCTS,
        payload: {products}
    }
}

export const isCurrencyAddedProduct = (currency) => {
    return {
        type: ADD_CURRENCY,
        payload: {currency}
    }
}