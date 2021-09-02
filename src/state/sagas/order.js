import { put, takeLatest, call } from 'redux-saga/effects'
import { EDIT_ORDER, PAY_ORDER, FETCH_SINGLE_ORDER } from 'state/reducers/order/types';
import { editOrderSuccess, editOrderError, fetchSingleOrderSuccess } from 'state/reducers/order/actions';
import Order from 'models/Order';
import { TOAST_TYPES, TOAST_MESSAGES } from 'helpers/constants';
import { NotifyType } from 'utils/NotifyType';

function* workerFetchSingleOrder({ payload }) {
    const { id } = payload;
    try {
        const response = yield call(Order.fetchSingle, id);
        yield put(fetchSingleOrderSuccess(response));
    } catch(error){
    } finally {
    }
}

function* workerEditOrder({ payload }) {
    const { order, defaultCallback, successCallback } = payload;
    try {
        const response = yield call(Order.editOrder, order);
        yield put(editOrderSuccess(response));
        yield successCallback(response.id);
        yield NotifyType(TOAST_TYPES.SUCCESS, TOAST_MESSAGES.ORDER_SAVED);
    } catch(error){
        if (error.status < 500 && error.status >= 400) {
            yield put(editOrderError(error.data))
        }
        else {
            yield NotifyType(TOAST_TYPES.ERROR, TOAST_MESSAGES.GENERIC_ERROR)
        }
        yield defaultCallback();
    } finally {

    }
}

function* workerPayOrder({ payload }) {
    const { id, defaultCallback, successCallback } = payload;
    try {
        const response = yield call(Order.payOrder, id);
        if (response.succeed) {
            yield successCallback();
            yield NotifyType(TOAST_TYPES.SUCCESS, TOAST_MESSAGES.PAYMENT_COMPLETED);
        } else {
            yield defaultCallback();
            yield NotifyType(TOAST_TYPES.ERROR, response.detail || TOAST_MESSAGES.GENERIC_ERROR);
        }
    } catch(error){
        yield NotifyType(TOAST_TYPES.ERROR, TOAST_MESSAGES.GENERIC_ERROR);
        yield defaultCallback();
    } finally {

    }
}

function* orderActions() {
    yield takeLatest(EDIT_ORDER, workerEditOrder);
    yield takeLatest(PAY_ORDER, workerPayOrder);
    yield takeLatest(FETCH_SINGLE_ORDER, workerFetchSingleOrder);
}

export default orderActions;