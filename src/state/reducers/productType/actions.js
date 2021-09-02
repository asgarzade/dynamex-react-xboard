import { FETCH_PRODUCT_TYPES, FETCH_PRODUCT_TYPES_SUCCESS } from "./types";

export const fetchProductTypes = () => ({
    type: FETCH_PRODUCT_TYPES
})

export const fetchProductTypesSuccess = productTypes => ({
    type: FETCH_PRODUCT_TYPES_SUCCESS,
    payload: {
        productTypes
    }
})