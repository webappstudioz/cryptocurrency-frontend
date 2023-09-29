import { PRODUCT, OVERVIEW, USAGE } from "./actionType";

export const productFetched = (product) => {
    return {
        type: OVERVIEW,
        payload: {product}
    }
}