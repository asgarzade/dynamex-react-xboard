import { put, takeLatest, call } from 'redux-saga/effects'
import { FETCH_DECLARATIONS, FETCH_ORDERS } from 'state/reducers/paydesk/types';
import { fetchPaydeskItemsSuccess, fetchPaydeskItemsError } from 'state/reducers/paydesk/actions';
import { setDeclarationsLoading, setOrdersLoading } from 'state/reducers/loading/actions';
import Declaration from 'models/Declaration';
import Order from 'models/Order';

function* workerFetchDeclarations({ payload }) {
    yield put(setDeclarationsLoading(true));
    try {
        const response = yield call(Declaration.fetchList, payload);
        yield put(fetchPaydeskItemsSuccess(response));
    } catch(error){
        yield put(fetchPaydeskItemsError());
        // console.log(error);
    } finally {
        yield put(setDeclarationsLoading(false));
    }
}

function* workerFetchOrders({ payload }) {
    yield put(setOrdersLoading(true));
    try {
        const response = yield call(Order.fetchList, payload);
        yield put(fetchPaydeskItemsSuccess(response));
    } catch(error){
        yield put(fetchPaydeskItemsError());
        // console.log(error);
    } finally {
        yield put(setOrdersLoading(false));
    }
}

function* fetchPayDeskItems() {
    yield takeLatest(FETCH_DECLARATIONS, workerFetchDeclarations);
    yield takeLatest(FETCH_ORDERS, workerFetchOrders);
}

export default fetchPayDeskItems;