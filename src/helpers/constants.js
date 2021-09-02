export const TOAST_TYPES = {
    SUCCESS: 'success',
    INFO: 'info',
    ERROR: 'error'
};

export const TOAST_MESSAGES = {
    DECLARATION_CREATED: 'Declaration Created',
    DECLARATION_SAVED: 'Declaration Saved',
    DECLARATION_DONE: 'Declaration(s) Moved to Done',
    PAYMENT_COMPLETED: 'Payment Completed',
    MARK_AS_DONE: 'Declaration Moved To Done',
    GENERIC_ERROR: 'Something went wrong. Please try again',
    ORDER_DONE: 'Order Completed',
    ORDER_DELETED: 'Order Deleted',
    ORDER_SAVED: 'Order Saved',
    COMMENT_ADDED: 'Comment Added',
    OPERATOR_CHANGED: 'Operator Changed',
    BALANCE_UPDATED: 'Balance Updated',
    MOVED_TO_PICKUP: 'Moved to Pickup',
    MOVED_TO_DONE: 'Moved to Done',
    SERVER_ERROR: 'Server Error',
};

export const dateFormat = 'MMM Do YYYY, kk:mm';

// Fixes the overlapping problem of the component
export const reactSelectStyle = {
    menu: provided => ({ ...provided, zIndex: 9999 })
};