import { CREATE_DECLARATION, EDIT_DECLARATION, CREATE_DECLARATION_SUCCESS, FETCH_SINGLE_DECLARATION, FETCH_SINGLE_DECLARATION_SUCCESS,
    CREATE_DECLARATION_ERROR, PAY_DECLARATIONS, CHANGE_DECLARATION_STATUS, EMPTY_DECLARATION_STATE, EMPTY_DECLARATION_ERRORS } from './types';

export const emptyDeclarationState = () => ({
    type: EMPTY_DECLARATION_STATE
});

export const emptyDeclarationErrors = () => ({
    type: EMPTY_DECLARATION_ERRORS
});

export const fetchSingleDeclaration = (id) => ({
    type: FETCH_SINGLE_DECLARATION,
    payload: {
        id
    }
});

export const fetchSingleDeclarationSuccess = (declaration) => ({
    type: FETCH_SINGLE_DECLARATION_SUCCESS,
    payload: {
        declaration
    }
})

export const createDeclaration = (payload) => ({
    type: CREATE_DECLARATION,
    payload
});

export const editDeclaration = (payload) => ({
    type: EDIT_DECLARATION,
    payload
});

export const createDeclarationSuccess = declaration => ({
    type: CREATE_DECLARATION_SUCCESS,
    payload: {
        declaration,
    }
});

export const createDeclarationError = errors => ({
    type: CREATE_DECLARATION_ERROR,
    payload: {
        errors
    }
});

export const payDeclarations = ({data, successCallback, defaultCallback}) => ({
   type: PAY_DECLARATIONS,
   payload: {
       data,
       successCallback,
       defaultCallback,
   }
});

export const changeDeclarationStatus = ({items, action, successCallback}) => ({
    type: CHANGE_DECLARATION_STATUS,
    payload: {
        items,
        action,
        successCallback
    }
});