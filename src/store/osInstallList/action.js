import { GET_LIST_OS, OS_LIST_FETCHED, REMOVE_OS_INSTALL_LIST } from "./actionType";

export const fetcheOsList = () => {
    return {
        type: GET_LIST_OS,
    }
}

export const osListFetched = () => {
    return {
        type: OS_LIST_FETCHED,
    }
}