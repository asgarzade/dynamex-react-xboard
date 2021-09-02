import { FETCH_OPERATOR_PROFILE_SUCCESS, FETCH_OPERATORS_SUCCESS } from './types';
import Operator from 'models/Operator';

export const operatorState = {
    operatorProfile: Operator.createDefault(),
    operators: [],
};

export default (state = operatorState, { type, payload }) => {
    switch (type) {
        case FETCH_OPERATOR_PROFILE_SUCCESS:
            return { ...state, operatorProfile: payload.operator };
        case FETCH_OPERATORS_SUCCESS:
            return { ...state, operators: payload.operators };
        default:
            return state;
    }
}