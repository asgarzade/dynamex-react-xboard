import { FETCH_ASSIGNED_ORDERS, FETCH_ASSIGNED_ORDERS_SUCCESS, CHANGE_ASSIGNEE,
    FETCH_ASSIGNED_ORDERS_ERROR, CHANGE_ASSIGNED_ORDER_STATUS, ADD_COMMENT,
    CHANGE_ASSIGNED_ORDER_STATUS_ERROR, CLEAR_ASSIGNED_ORDER_ACTION_ERRORS } from "./types";

export const fetchAssignedOrders = ({user, status, page}) => ({
    type: FETCH_ASSIGNED_ORDERS,
    payload: {
        user,
        status,
        page
    }
});

export const fetchAssignedOrdersSuccess = (data) => ({
    type: FETCH_ASSIGNED_ORDERS_SUCCESS,
    payload: {
        data
    }
});

export const fetchAssignedOrdersError = () => ({
    type: FETCH_ASSIGNED_ORDERS_ERROR,
});

export const changeAssignedOrderStatus = (payload) => ({
    type: CHANGE_ASSIGNED_ORDER_STATUS,
    payload
});
export const changeAssignedOrderStatusError = (errors) => ({
    type: CHANGE_ASSIGNED_ORDER_STATUS_ERROR,
    payload: {
        errors
    }
});
export const clearAssignedOrderActionErrors = () => ({
    type: CLEAR_ASSIGNED_ORDER_ACTION_ERRORS,
});

export const addCommentToAssignment = (payload) => ({
    type: ADD_COMMENT,
    payload
});

export const changeAssignee = (payload) => ({
    type: CHANGE_ASSIGNEE,
    payload
});