import { FETCH_WAREHOUSE_ORDERS, FETCH_WAREHOUSE_ORDERS_SUCCESS, FETCH_WAREHOUSE_ORDERS_ERROR,
    FETCH_WAREHOUSE_DECLARATIONS, FETCH_WAREHOUSE_DECLARATIONS_SUCCESS, FETCH_WAREHOUSE_DECLARATIONS_ERROR } from "./types";

export const fetchWarehouseOrders = payload => ({
    type: FETCH_WAREHOUSE_ORDERS,
    payload
});

export const fetchWarehouseDeclarations = payload => ({
    type: FETCH_WAREHOUSE_DECLARATIONS,
    payload
});

export const fetchWarehouseOrdersSuccess = ({orders}) => ({
    type: FETCH_WAREHOUSE_ORDERS_SUCCESS,
    payload: {
        orders,
    }
});

export const fetchWarehouseDeclarationsSuccess = ({declarations}) => ({
    type: FETCH_WAREHOUSE_DECLARATIONS_SUCCESS,
    payload: {
        declarations,
    }
});

export const fetchWarehouseOrdersError = () => ({
    type: FETCH_WAREHOUSE_ORDERS_ERROR
});

export const fetchWarehouseDeclarationsError = () => ({
    type: FETCH_WAREHOUSE_DECLARATIONS_ERROR
});