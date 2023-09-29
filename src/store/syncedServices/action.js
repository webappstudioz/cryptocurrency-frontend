import { FETCHED_SERVICES, REMOVE_FETCHED_SERVICES } from "./actionType";

export const isSyncServicesFetched = (services) => {
    return {
        type: FETCHED_SERVICES,
        payload: {services}
    }
}

export const removeFetchedServices = () => {
    return {
        type: REMOVE_FETCHED_SERVICES,
    }
}