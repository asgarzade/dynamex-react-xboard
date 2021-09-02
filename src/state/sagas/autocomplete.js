import { put, takeLatest, call } from 'redux-saga/effects'
import { FETCH_AUTOCOMPLETE_USERS } from 'state/reducers/autocomplete/types';
import { fetchAutocompleteUsersSuccess } from 'state/reducers/autocomplete/actions';
import Autocomplete from 'models/Autocomplete';

function* workerFetchAutocompleteUsers({ payload }) {
    const { query, defaultCallback } = payload;
    try {
        const response = yield call(Autocomplete.fetchUsers, query);
        yield put(fetchAutocompleteUsersSuccess(response));
    } catch(error){
        // console.log(error);
    } finally {
        yield defaultCallback();
    }
}

function* fetchAutocompleteUsers() {
    yield takeLatest(FETCH_AUTOCOMPLETE_USERS, workerFetchAutocompleteUsers);
}

export default fetchAutocompleteUsers;