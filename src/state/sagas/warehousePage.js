import { put, takeLatest, call } from 'redux-saga/effects'
import { FETCH_WAREHOUSE_ORDERS, FETCH_WAREHOUSE_DECLARATIONS } from 'state/reducers/warehousePage/types';
import { fetchWarehouseOrdersSuccess, fetchWarehouseDeclarationsSuccess,
    fetchWarehouseOrdersError, fetchWarehouseDeclarationsError } from 'state/reducers/warehousePage/actions';
import { setDeclarationsLoading, setOrdersLoading } from 'state/reducers/loading/actions';
import Declaration from 'models/Declaration';
import Order from 'models/Order';

function* workerFetchWarehouseOrders({ payload }) {
    yield put(setOrdersLoading(true));
    try {
        const orders = yield call(Order.fetchList, payload);
        yield put(fetchWarehouseOrdersSuccess({orders}));
    } catch(error){
        yield put(fetchWarehouseOrdersError());
    } finally {
        yield put(setOrdersLoading(false));
    }
}

function* workerFetchWarehouseDeclarations({ payload }) {
    yield put(setDeclarationsLoading(true));
    try {
        const declarations = yield call(Declaration.fetchList, payload);
        yield put(fetchWarehouseDeclarationsSuccess({declarations}));
    } catch(error){
        yield put(fetchWarehouseDeclarationsError());
    } finally {
        yield put(setDeclarationsLoading(false));
    }
}

function* fetchWarehouseItems() {
    yield takeLatest(FETCH_WAREHOUSE_ORDERS, workerFetchWarehouseOrders);
    yield takeLatest(FETCH_WAREHOUSE_DECLARATIONS, workerFetchWarehouseDeclarations);
}

export default fetchWarehouseItems;