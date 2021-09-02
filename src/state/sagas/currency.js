import { put, takeLatest, call } from 'redux-saga/effects'
import { FETCH_CURRENCIES } from 'state/reducers/currency/types';
import { fetchCurrenciesSuccess } from 'state/reducers/currency/actions';
import Currency from 'models/Currency';

function* workerFetchCurrencies() {
    try {
        const response = yield call(Currency.fetchList);
        yield put(fetchCurrenciesSuccess(response));
    } catch(error){
        console.log(error);
    } finally {

    }
}

function* fetchCurrencies() {
    yield takeLatest(FETCH_CURRENCIES, workerFetchCurrencies);
}

export default fetchCurrencies;