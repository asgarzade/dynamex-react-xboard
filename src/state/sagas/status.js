import { put, takeLatest, call } from 'redux-saga/effects'
import { FETCH_ORDER_STATUSES, FETCH_DECLARATION_STATUSES, FETCH_ASSIGNED_ORDER_STATUSES } from 'state/reducers/status/types';
import { fetchOrderStatusesSuccess, fetchDeclarationStatusesSuccess, fetchAssignedOrderStatusesSuccess } from 'state/reducers/status/actions';
import { setOrdersLoading } from 'state/reducers/loading/actions';
import Status from 'models/Status';

function* workerFetchOrderStatuses({ payload }) {
    try {
        const response = yield call(Status.fetchOrderStatuses, payload.panel);
        yield put(fetchOrderStatusesSuccess(response));
    } catch(error){
        // console.log(error);
    } finally {
    }
}

function* workerFetchAssignedOrderStatuses({ payload }) {
    yield put(setOrdersLoading(true));
    try {
        const response = yield call(Status.fetchAssignedOrderStatuses);
        yield put(fetchAssignedOrderStatusesSuccess(response));
    } catch(error){
        // console.log(error);
    } finally {
        yield put(setOrdersLoading(false));
    }
}

function* workerFetchDeclarationStatuses({ payload }) {
    try {
        const response = yield call(Status.fetchDeclarationStatuses, payload.panel);
        yield put(fetchDeclarationStatusesSuccess(response));
    } catch(error){
        // console.log(error);
    } finally {
    }
}

function* fetchStatuses() {
    yield takeLatest(FETCH_ORDER_STATUSES, workerFetchOrderStatuses);
    yield takeLatest(FETCH_DECLARATION_STATUSES, workerFetchDeclarationStatuses);
    yield takeLatest(FETCH_ASSIGNED_ORDER_STATUSES, workerFetchAssignedOrderStatuses);
}

export default fetchStatuses;