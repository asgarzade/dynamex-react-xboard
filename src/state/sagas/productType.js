import { put, takeLatest, call } from 'redux-saga/effects'
import { FETCH_PRODUCT_TYPES } from 'state/reducers/productType/types';
import { fetchProductTypesSuccess } from 'state/reducers/productType/actions';
import ProductType from 'models/ProductType';

function* workerFetchProductTypes() {
    try {
        const response = yield call(ProductType.fetchList);
        yield put(fetchProductTypesSuccess(response));
    } catch(error){
        console.log(error);
    } finally {

    }
}

function* fetchProductTypes() {
    yield takeLatest(FETCH_PRODUCT_TYPES, workerFetchProductTypes);
}

export default fetchProductTypes;