import { FETCH_COUNTRIES_SUCCESS } from './types'
export const countriesState = []

export default (state = countriesState, { type, payload }) => {
    switch (type) {
        case FETCH_COUNTRIES_SUCCESS:
            return payload.countries;
        default:
            return state;
    }
}