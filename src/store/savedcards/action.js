import { GET_CARDS, CARDS_FETCHED, REMOVE_CARDS } from "./actionType";

export const getCards = (cards) => {
    return {
        type: GET_CARDS,
        payload: {cards}
    }
}

export const cardsFetched = (cards) => {
    return {
        type : CARDS_FETCHED,
        payload: {cards}
    }
}

export const removeCards = (cards) => {
    return {
        type: REMOVE_CARDS,
        payload: {cards},
    }
}