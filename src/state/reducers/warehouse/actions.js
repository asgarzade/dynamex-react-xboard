import { FETCH_WAREHOUSES, FETCH_WAREHOUSES_SUCCESS } from "./types";

export const fetchWarehouses = () => ({
    type: FETCH_WAREHOUSES
})

export const fetchWarehousesSuccess = warehouses => ({
    type: FETCH_WAREHOUSES_SUCCESS,
    payload: {
        warehouses
    }
})