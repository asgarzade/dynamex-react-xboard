import { FETCH_WAREHOUSE_ORDERS_SUCCESS, FETCH_WAREHOUSE_DECLARATIONS_SUCCESS,
    FETCH_WAREHOUSE_DECLARATIONS_ERROR, FETCH_WAREHOUSE_ORDERS_ERROR} from './types'

export const warehouseItemsState = {
    declarations: {
        pageCount: 0,
        currentPage: 0,
        results: []
    },
    orders: {
        pageCount: 0,
        currentPage: 0,
        results: []
    }
};

export default (state = warehouseItemsState, { type, payload }) => {
    switch (type) {
        case FETCH_WAREHOUSE_ORDERS_SUCCESS:
            return { ...state, orders: payload.orders };
        case FETCH_WAREHOUSE_DECLARATIONS_SUCCESS:
            return { ...state, declarations: payload.declarations };
        case FETCH_WAREHOUSE_ORDERS_ERROR:
            return { ...state, orders: warehouseItemsState.orders };
        case FETCH_WAREHOUSE_DECLARATIONS_ERROR:
            return { ...state, declarations: warehouseItemsState.declarations };
        default:
            return state;
    }
}