import { put, takeLatest, call } from 'redux-saga/effects'
import { FETCH_BAGS } from 'state/reducers/bag/types';
import { fetchBagsSuccess } from 'state/reducers/bag/actions';
import Bag from 'models/Bag';

function* workerFetchBags() {
    try {
        const response = yield call(Bag.fetchList);
        yield put(fetchBagsSuccess(response));
    } catch(error){
        console.log(error);
    } finally {

    }
}

function* fetchBags() {
    yield takeLatest(FETCH_BAGS, workerFetchBags);
}

export default fetchBags;