import { FETCH_USER_PROFILE, FETCH_USER_PROFILE_SUCCESS, UPDATE_BALANCE, UPDATE_BALANCE_SUCCESS } from './types';

export const fetchUserProfile = clientCode => ({
    type: FETCH_USER_PROFILE,
    payload: {
        clientCode
    }
});

export const fetchUserProfileSuccess = user => ({
    type: FETCH_USER_PROFILE_SUCCESS,
    payload: {
        user
    }
});

export const updateBalance = ({data, successCallback, errorCallback}) => ({
    type: UPDATE_BALANCE,
    payload: {
        data,
        successCallback,
        errorCallback,
    }
});

export const updateBalanceSuccess = balanceReport => ({
    type: UPDATE_BALANCE_SUCCESS,
    payload: {
        balanceReport
    }
});

// export const updateBalanceError = hasError => ({
//     type: hasError ? BALANCE_ERROR_TRUE : BALANCE_ERROR_FALSE,
// });