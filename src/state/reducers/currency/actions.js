import { FETCH_CURRENCIES, FETCH_CURRENCIES_SUCCESS } from "./types";

export const fetchCurrencies = () => ({
    type: FETCH_CURRENCIES
})

export const fetchCurrenciesSuccess = currencies => ({
    type: FETCH_CURRENCIES_SUCCESS,
    payload: {
        currencies
    }
})