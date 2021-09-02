import { FETCH_PAYDESK_ITEMS_SUCCESS, FETCH_PAYDESK_ITEMS_ERROR } from './types'
export const paydeskState = {
    pageCount: 0,
    currentPage: 0,
    results: []
};

export default (state = paydeskState, { type, payload }) => {
    switch (type) {
        case FETCH_PAYDESK_ITEMS_SUCCESS:
            return payload.data;
        case FETCH_PAYDESK_ITEMS_ERROR:
            return paydeskState;
        default:
            return state;
    }
}