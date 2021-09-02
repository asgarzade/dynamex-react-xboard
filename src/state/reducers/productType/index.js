import { FETCH_PRODUCT_TYPES_SUCCESS } from './types'
export const productTypesState = [];

export default (state = productTypesState, { type, payload }) => {
    switch (type) {
        case FETCH_PRODUCT_TYPES_SUCCESS:
            return payload.productTypes;
        default:
            return state;
    }
}