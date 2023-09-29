import { ADD_CURRENCY, GET_WIDGETS, WIDGETS_FETCHED } from "./actionType";

export const isWidgetsFetched = (widgets) => {
    return {
        type: WIDGETS_FETCHED,
        payload: {widgets}
    }
}

export const isCurrencyAddedModal = (currency) => {
    return {
        type: ADD_CURRENCY,
        payload: {currency}
    }
}