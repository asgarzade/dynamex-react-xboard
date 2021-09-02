import { FETCH_ORDERS, FETCH_DECLARATIONS, FETCH_PAYDESK_ITEMS_SUCCESS, FETCH_PAYDESK_ITEMS_ERROR } from "./types";

export const fetchDeclarations = payload => ({
    type: FETCH_DECLARATIONS,
    payload
});

export const fetchOrders = payload => ({
    type: FETCH_ORDERS,
    payload
});

export const fetchPaydeskItemsSuccess = data => ({
    type: FETCH_PAYDESK_ITEMS_SUCCESS,
    payload: {
        data
    }
});

export const fetchPaydeskItemsError = () => ({
    type: FETCH_PAYDESK_ITEMS_ERROR,
});