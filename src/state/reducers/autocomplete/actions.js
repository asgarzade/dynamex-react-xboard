import { FETCH_AUTOCOMPLETE_USERS, FETCH_AUTOCOMPLETE_USERS_SUCCESS } from './types';

export const fetchAutocompleteUsers = payload => ({
    type: FETCH_AUTOCOMPLETE_USERS,
    payload
});

export const fetchAutocompleteUsersSuccess = users => ({
    type: FETCH_AUTOCOMPLETE_USERS_SUCCESS,
    payload: {
        users
    }
});