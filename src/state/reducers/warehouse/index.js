import { FETCH_WAREHOUSES_SUCCESS } from './types'
export const warehousesState = []

export default (state = warehousesState, { type, payload }) => {
    switch (type) {
        case FETCH_WAREHOUSES_SUCCESS:
            return payload.warehouses;
        default:
            return state;
    }
}