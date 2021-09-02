import { FETCH_CHOICES, FETCH_CHOICES_SUCCESS } from './types';

export const fetchChoices = () => ({
    type: FETCH_CHOICES,
});

export const fetchChoicesSuccess = choices => ({
    type: FETCH_CHOICES_SUCCESS,
    payload: {
        choices
    }
});