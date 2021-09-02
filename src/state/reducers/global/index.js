import { LOADING_ON, LOADING_OFF, SHOW_MODAL, HIDE_MODAL } from "./types"

export const globalState = {
    loading: false,
    modal: {
        modalType: null,
        modalProps: {}
    }
}

export default (state = globalState, { type, payload }) => {
    switch(type){
        case LOADING_ON:
            return { ...state, loading: true };
        case LOADING_OFF:
            return { ...state, loading: false };
        case SHOW_MODAL:
            return { ...state, modal: {
                modalType: payload.modalType,
                modalProps: payload.modalProps
            }};
        case HIDE_MODAL:
            return { ...state, modal: {
                modalType: null,
                modalProps: {}
            } };
        default:
            return state;    
    }
}