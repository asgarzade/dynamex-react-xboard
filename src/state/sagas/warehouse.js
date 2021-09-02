import { put, takeLatest, call } from 'redux-saga/effects'
import { FETCH_WAREHOUSES } from 'state/reducers/warehouse/types';
import { fetchWarehousesSuccess } from 'state/reducers/warehouse/actions';
import Warehouse from 'models/Warehouse';

function* workerFetchWarehouses() {
    try {
        const response = yield call(Warehouse.fetchList);
        yield put(fetchWarehousesSuccess(response));
    } catch(error){
        console.log(error);
    } finally {

    }
}

function* fetchWarehouses() {
    yield takeLatest(FETCH_WAREHOUSES, workerFetchWarehouses);
}

export default fetchWarehouses;