import { GET_CARDS, CARDS_FETCHED, REMOVE_CARDS } from "./actionType";

const initialState = {
    cards: "",
    cardsUpdated: false
}

const savedCards = (state = initialState, action) => {
    switch(action?.type) {
        case GET_CARDS: 
            state = {
                ...state,
                cardsUpdated: false
            }
            break
        case CARDS_FETCHED:
            state = {
                ...state,
                cards: action.payload?.cards,
                cardsUpdated: true
            }
            break
        case REMOVE_CARDS:
            state = {
                cards: [],
                cardsUpdated: false
            }
            break
        default:
            state = { ...state }
            break
    }
    return state
}

export default savedCards