import { put, takeLatest, call } from 'redux-saga/effects'
import { FETCH_ASSIGNED_ORDERS, CHANGE_ASSIGNED_ORDER_STATUS, ADD_COMMENT, CHANGE_ASSIGNEE } from 'state/reducers/assignedOrder/types';
import { fetchAssignedOrdersSuccess, fetchAssignedOrdersError, changeAssignedOrderStatusError } from 'state/reducers/assignedOrder/actions';
import { setOrdersLoading } from 'state/reducers/loading/actions';
import { TOAST_TYPES, TOAST_MESSAGES } from 'helpers/constants';
import { NotifyType } from 'utils/NotifyType';
import AssignedOrders from 'models/AssignedOrders';

function* fetchAssignedOrdersWorker({ payload }) {
    yield put(setOrdersLoading(true));
    try {
        const response = yield call(AssignedOrders.fetchList, payload);
        yield put(fetchAssignedOrdersSuccess(response));
    } catch(error){
        yield put(fetchAssignedOrdersError());
    } finally {
        yield put(setOrdersLoading(false));
    }
}

function* changeAssignedOrderStatusWorker({ payload }) {
    // yield put(setOrdersLoading(true));
    const { items, action, orderCode, deletionReason, successCallback, defaultCallback } = payload;
    try {
        const response = yield call(AssignedOrders.changeAssignedOrderStatus, {items, action, orderCode, deletionReason});

        let hasActionSucceeded = false;

        switch (action) {
            case 'done':
                yield NotifyType(TOAST_TYPES.SUCCESS, TOAST_MESSAGES.ORDER_DONE);
                hasActionSucceeded = true;
                break;
            case 'delete':
                response.forEach(item => {
                    if (item.succeed) {
                        hasActionSucceeded = true;
                        NotifyType(TOAST_TYPES.SUCCESS, TOAST_MESSAGES.ORDER_DELETED);
                    } else {
                        NotifyType(TOAST_TYPES.ERROR, item.detail);
                    }
                });
                break;
            default:
                break;
        }

        if (hasActionSucceeded) yield successCallback();
        else yield defaultCallback();
    } catch(error) {
        let errorMessage = '';
        const { status } = error;
        let showNotify = true;

        if (status === 401 || status === 403 || status === 404) {
            errorMessage = error.detail;
        } else if (status >= 500) {
            errorMessage = TOAST_MESSAGES.SERVER_ERROR;
        } else if (status === 400) {
            yield put(changeAssignedOrderStatusError(error.data));
            showNotify = false;
        }

        if (showNotify) yield NotifyType(TOAST_TYPES.ERROR, errorMessage || TOAST_MESSAGES.GENERIC_ERROR);
        if (defaultCallback) yield defaultCallback();
    } finally {
        // yield put(setOrdersLoading(false));
    }
}

function* workerAddComment({ payload }) {
    const { id, body, successCallback, defaultCallback } = payload;
    try {
        yield call(AssignedOrders.addComment, id, body);
        yield NotifyType(TOAST_TYPES.SUCCESS, TOAST_MESSAGES.COMMENT_ADDED);
        yield successCallback();
    } catch(error) {
        console.log('here')
        yield NotifyType(TOAST_TYPES.ERROR, TOAST_MESSAGES.GENERIC_ERROR);
        yield defaultCallback();
    } finally {

    }
}

function* workerChangeAssignee({ payload }) {
    const { id, operatorCode, successCallback, defaultCallback } = payload;
    try {
        yield call(AssignedOrders.changeAssignee, id, operatorCode);
        yield NotifyType(TOAST_TYPES.SUCCESS, TOAST_MESSAGES.OPERATOR_CHANGED);
        yield successCallback();
    } catch(error) {
        console.log('here')
        yield NotifyType(TOAST_TYPES.ERROR, TOAST_MESSAGES.GENERIC_ERROR);
        yield defaultCallback();
    } finally {

    }
}

function* assignedOrderActions() {
    yield takeLatest(FETCH_ASSIGNED_ORDERS, fetchAssignedOrdersWorker);
    yield takeLatest(CHANGE_ASSIGNED_ORDER_STATUS, changeAssignedOrderStatusWorker);
    yield takeLatest(ADD_COMMENT, workerAddComment);
    yield takeLatest(CHANGE_ASSIGNEE, workerChangeAssignee);
}

export default assignedOrderActions;
