import { FETCH_COUNTRIES, FETCH_COUNTRIES_SUCCESS } from "./types";

export const fetchCountries = () => ({
    type: FETCH_COUNTRIES
})

export const fetchCountriesSuccess = countries => ({
    type: FETCH_COUNTRIES_SUCCESS,
    payload: {
        countries
    }
})