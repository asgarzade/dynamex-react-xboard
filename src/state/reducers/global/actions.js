import { LOADING_ON, LOADING_OFF } from "./types";

// loading icon
export const loading = is_loading => ({
    type: is_loading ? LOADING_ON : LOADING_OFF
})

// modal
export const showModal = (modalProps, modalType) => ({
    type: SHOW_MODAL,
    payload: {
        modalProps,
        modalType
    }
});

export const hideModal = () => ({
    type: HIDE_MODAL,
});