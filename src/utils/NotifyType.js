// import React from 'react'
import {toast} from "react-toastify";

export const NotifyType = (type, text) => {
    switch (type) {
        case 'error':
            toast.error(text, {
                position: toast.POSITION.BOTTOM_LEFT,
                autoClose: false
            });
            break;
        case 'info':
            toast.info(text, {position: toast.POSITION.BOTTOM_LEFT});
            break;
        case 'success':
            toast.success(text, {position: toast.POSITION.BOTTOM_LEFT});
            break;
        default:
            break;
    }
};