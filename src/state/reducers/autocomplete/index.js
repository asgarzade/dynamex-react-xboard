import { FETCH_AUTOCOMPLETE_USERS_SUCCESS } from './types';

export const autocompleteState = {
    users: []
}

export default (state = autocompleteState, { type, payload }) => {
    switch (type) {
        case FETCH_AUTOCOMPLETE_USERS_SUCCESS:
            return { ...state, users: payload.users };    
        default:
            return state;
    }
}