import { FETCH_CHOICES_SUCCESS } from './types';
import Choice from 'models/Choice';

export const choicesState = Choice.createDefault();

export default (state = choicesState, { type, payload }) => {
    switch (type) {
        case FETCH_CHOICES_SUCCESS:
            return payload.choices;    
        default:
            return state;
    }
}