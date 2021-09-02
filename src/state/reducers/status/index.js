import { FETCH_DECLARATION_STATUSES_SUCCESS, FETCH_ORDER_STATUSES_SUCCESS, FETCH_ASSIGNED_ORDER_STATUSES_SUCCESS } from './types'
export const statusesState = {
    orderStatuses: [],
    declarationStatuses: [],
    assignedOrderStatuses: [],
};

export default (state = statusesState, { type, payload }) => {
    switch (type) {
        case FETCH_ORDER_STATUSES_SUCCESS:
            return { ...state, orderStatuses: payload.statuses };
        case FETCH_ASSIGNED_ORDER_STATUSES_SUCCESS:
            return { ...state, assignedOrderStatuses: payload.statuses };
        case FETCH_DECLARATION_STATUSES_SUCCESS:
            return { ...state, declarationStatuses: payload.statuses };
        default:
            return state;
    }
}