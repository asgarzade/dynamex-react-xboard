import { CREATE_DECLARATION_SUCCESS, CREATE_DECLARATION_ERROR, EMPTY_DECLARATION_STATE, FETCH_SINGLE_DECLARATION_SUCCESS, EMPTY_DECLARATION_ERRORS } from './types'
export const declarationState = {
    declaration: {},
    errors: {}
};

export default (state = declarationState, { type, payload }) => {
    switch (type) {
        case FETCH_SINGLE_DECLARATION_SUCCESS:
            return { ...state, declaration: payload.declaration};
        case CREATE_DECLARATION_SUCCESS:
            return { ...state, declaration: payload.declaration};
        case CREATE_DECLARATION_ERROR:
            return { ...state, errors: payload.errors};
        case EMPTY_DECLARATION_STATE:
            return { declarationState };
        case EMPTY_DECLARATION_ERRORS:
            return { ...state, errors: {} };
        default:
            return state;
    }
}