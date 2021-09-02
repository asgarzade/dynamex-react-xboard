import { DECLARATIONS_LOADING_ON, DECLARATIONS_LOADING_OFF, ORDERS_LOADING_ON, ORDERS_LOADING_OFF,
    ASSIGNED_ORDERS_LOADING_OFF, ASSIGNED_ORDERS_LOADING_ON, USER_LOADING_OFF, USER_LOADING_ON} from "./types";

export const setDeclarationsLoading = isLoading => ({
    type: isLoading ? DECLARATIONS_LOADING_ON : DECLARATIONS_LOADING_OFF
});

export const setOrdersLoading = isLoading => ({
    type: isLoading ? ORDERS_LOADING_ON : ORDERS_LOADING_OFF
});

export const setUserLoading = isLoading => ({
    type: isLoading ? USER_LOADING_ON : USER_LOADING_OFF
});

export const setAssignedOrdersLoading = isLoading => ({
    type: isLoading ? ASSIGNED_ORDERS_LOADING_ON : ASSIGNED_ORDERS_LOADING_OFF
});