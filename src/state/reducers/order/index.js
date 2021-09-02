import { EDIT_ORDER_SUCCESS, EDIT_ORDER_ERROR, EMPTY_ORDER_ERRORS, FETCH_SINGLE_ORDER_SUCCESS, EMPTY_ORDER } from './types'
export const orderState = {
    order: {},
    errors: {},
};

export default (state = orderState, { type, payload }) => {
    switch (type) {
        case EDIT_ORDER_SUCCESS:
            return { ...state, order: payload.order };
        case EDIT_ORDER_ERROR:
            return { ...state, errors: payload.errors };
        case EMPTY_ORDER_ERRORS:
            return { ...state, errors: {} };
        case FETCH_SINGLE_ORDER_SUCCESS:
            return { ...state, order: payload.order }
        case EMPTY_ORDER:
            return { ...state, order: {} }
        default:
            return state;
    }
}