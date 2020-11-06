import React from 'react'

export const TOAST_TYPES = {
    ERROR: "error",
    SUCCESS: "success",
    INFO: "info",
}

export const ToastContext = React.createContext({
    toast: {
        message: "",
        type: TOAST_TYPES.SUCCESS,
        duration: 2500,
    },
    setToast: null,
});

export const createToast = setToast => (message = "", type = TOAST_TYPES.SUCCESS, duration = 2500) => {
    setToast({
        message,
        type,
        duration
    });
}