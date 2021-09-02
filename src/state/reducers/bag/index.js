import { FETCH_BAGS_SUCCESS } from './types'
export const bagsState = [];

export default (state = bagsState, { type, payload }) => {
    switch (type) {
        case FETCH_BAGS_SUCCESS:
            return payload.bags;
        default:
            return state;
    }
}