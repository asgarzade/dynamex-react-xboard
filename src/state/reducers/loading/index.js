import { DECLARATIONS_LOADING_ON, DECLARATIONS_LOADING_OFF, ORDERS_LOADING_ON, ORDERS_LOADING_OFF,
    ASSIGNED_ORDERS_LOADING_OFF, ASSIGNED_ORDERS_LOADING_ON, USER_LOADING_OFF, USER_LOADING_ON } from "./types";

export const loadingState = {
    declarationsLoading: false,
    ordersLoading: false,
    assignedOrdersLoading: false,
    userLoading: false,
};

export default (state = loadingState, { type }) => {
    switch(type){
        case DECLARATIONS_LOADING_ON:
            return { ...state, declarationsLoading: true };
        case DECLARATIONS_LOADING_OFF:
            return { ...state, declarationsLoading: false };
        case ORDERS_LOADING_ON:
            return { ...state, ordersLoading: true };
        case ORDERS_LOADING_OFF:
            return { ...state, ordersLoading: false };
        case ASSIGNED_ORDERS_LOADING_ON:
            return { ...state, assignedOrdersLoading: true };
        case ASSIGNED_ORDERS_LOADING_OFF:
            return { ...state, assignedOrdersLoading: false };
        case USER_LOADING_ON:
            return { ...state, userLoading: true };
        case USER_LOADING_OFF:
            return { ...state, userLoading: false };
        default:
            return state;
    }
}