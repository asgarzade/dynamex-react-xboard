import { FETCH_OPERATOR_PROFILE, FETCH_OPERATOR_PROFILE_SUCCESS, FETCH_OPERATORS, FETCH_OPERATORS_SUCCESS } from './types';

export const fetchOperatorProfile = () => ({
    type: FETCH_OPERATOR_PROFILE,
});
export const fetchOperatorProfileSuccess = (operator) => ({
    type: FETCH_OPERATOR_PROFILE_SUCCESS,
    payload: {
        operator
    }
});

export const fetchOperators = () => ({
    type: FETCH_OPERATORS,
});
export const fetchOperatorsSuccess = (operators) => ({
    type: FETCH_OPERATORS_SUCCESS,
    payload: {
        operators
    }
});
