import { FETCH_CURRENCIES_SUCCESS } from './types'
export const currenciesState = [];

export default (state = currenciesState, { type, payload }) => {
    switch (type) {
        case FETCH_CURRENCIES_SUCCESS:
            return payload.currencies;
        default:
            return state;
    }
}