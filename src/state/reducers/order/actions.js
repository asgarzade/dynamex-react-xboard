import { EDIT_ORDER, EDIT_ORDER_SUCCESS, EDIT_ORDER_ERROR, EMPTY_ORDER_ERRORS, PAY_ORDER, 
    FETCH_SINGLE_ORDER, FETCH_SINGLE_ORDER_SUCCESS, EMPTY_ORDER } from './types';

export const editOrder = payload => ({
    type: EDIT_ORDER,
    payload
});

export const editOrderSuccess = order => ({
    type: EDIT_ORDER_SUCCESS,
    payload: {
        order,
    }
});

export const editOrderError = errors => ({
    type: EDIT_ORDER_ERROR,
    payload: {
        errors
    }
});

export const emptyOrderErrors = () => ({
    type: EMPTY_ORDER_ERRORS,
});

export const payOrder = payload => ({
    type: PAY_ORDER,
    payload,
});

export const fetchSingleOrder = id => ({
    type: FETCH_SINGLE_ORDER,
    payload: {
        id
    }
})

export const fetchSingleOrderSuccess = order => ({
    type: FETCH_SINGLE_ORDER_SUCCESS,
    payload: {
        order
    }
})

export const emptyOrder = () => ({
    type: EMPTY_ORDER,
})