import { FETCH_ASSIGNED_ORDERS_SUCCESS, FETCH_ASSIGNED_ORDERS_ERROR, CHANGE_ASSIGNED_ORDER_STATUS_ERROR, CLEAR_ASSIGNED_ORDER_ACTION_ERRORS } from './types'

export const assignedOrdersState = {
    list: {
        pageCount: 0,
        currentPage: 0,
        results: []
    },
    errors: {}
};

export default (state = assignedOrdersState, { type, payload }) => {
    switch (type) {
        case FETCH_ASSIGNED_ORDERS_SUCCESS:
            return { ...state, list: payload.data};
        case FETCH_ASSIGNED_ORDERS_ERROR:
            return { ...state, list: assignedOrdersState.list};
        case CHANGE_ASSIGNED_ORDER_STATUS_ERROR:
            return { ...state, errors: payload.errors};
        case CLEAR_ASSIGNED_ORDER_ACTION_ERRORS:
            return { ...state, errors: {}};
        default:
            return state;
    }
}
