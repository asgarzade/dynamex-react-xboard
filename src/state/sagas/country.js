import { put, takeLatest, call } from 'redux-saga/effects'
import { FETCH_COUNTRIES } from 'state/reducers/country/types';
import { fetchCountriesSuccess } from 'state/reducers/country/actions';
import Country from 'models/Country';

function* workerFetchCountries() {
    try {
        const response = yield call(Country.fetchList);
        yield put(fetchCountriesSuccess(response));
    } catch(error){
        console.log(error);
    } finally {
        
    }
}

function* fetchCountries() {
    yield takeLatest(FETCH_COUNTRIES, workerFetchCountries);
}

export default fetchCountries;