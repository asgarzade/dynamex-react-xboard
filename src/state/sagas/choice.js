import { put, takeLatest, call } from 'redux-saga/effects'
import { FETCH_CHOICES } from 'state/reducers/choice/types';
import { fetchChoicesSuccess } from 'state/reducers/choice/actions';
import Choice from 'models/Choice';

function* workerFetchChoices() {
    try {
        const response = yield call(Choice.fetchChoices);
        yield put(fetchChoicesSuccess(response));
    } catch(error){
        console.error(error);
    } finally {

    }
}

function* fetchChoices() {
    yield takeLatest(FETCH_CHOICES, workerFetchChoices);
}

export default fetchChoices;