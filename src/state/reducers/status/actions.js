import { FETCH_ORDER_STATUSES, FETCH_DECLARATION_STATUSES, FETCH_ORDER_STATUSES_SUCCESS,
    FETCH_DECLARATION_STATUSES_SUCCESS, FETCH_ASSIGNED_ORDER_STATUSES, FETCH_ASSIGNED_ORDER_STATUSES_SUCCESS } from "./types";

export const fetchOrderStatuses = (panel) => ({
    type: FETCH_ORDER_STATUSES,
    payload: {
        panel,
    }
});

export const fetchAssignedOrderStatuses = (panel) => ({
    type: FETCH_ASSIGNED_ORDER_STATUSES,
});

export const fetchDeclarationStatuses = (panel) => ({
    type: FETCH_DECLARATION_STATUSES,
    payload: {
        panel,
    }
});

export const fetchOrderStatusesSuccess = (statuses) => ({
    type: FETCH_ORDER_STATUSES_SUCCESS,
    payload: {
        statuses
    }
});

export const fetchAssignedOrderStatusesSuccess = (statuses) => ({
    type: FETCH_ASSIGNED_ORDER_STATUSES_SUCCESS,
    payload: {
        statuses
    }
});

export const fetchDeclarationStatusesSuccess = (statuses) => ({
    type: FETCH_DECLARATION_STATUSES_SUCCESS,
    payload: {
        statuses
    }
});