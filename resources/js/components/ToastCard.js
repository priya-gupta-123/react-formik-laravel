import React, { useEffect } from 'react'
import { TOAST_TYPES } from '../contexts/ToastContext';

export default function ToastCard({ toast, setToast }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            setToast(null);
        }, toast.duration);

        return () => {
            clearTimeout(timer);
        }
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                zIndex: 999,
                right: "1rem",
                bottom: "1rem",
            }}
            className={"px-2 py-2 shadow-md rounded-md text-white " + getClass(toast.type)}>
            {toast.message}
            <span
                onClick={() => {
                    setToast(null);
                }}
                className="cursor-pointer p-1 ml-2">&times;</span>
        </div>
    )
}

function getClass(type = "info") {
    switch (type) {
        case TOAST_TYPES.INFO:
            return "bg-blue-500";
        case TOAST_TYPES.SUCCESS:
            return "bg-green-500";
        case TOAST_TYPES.ERROR:
            return "bg-red-500";
        default:
            return "bg-blue-400";
    }
}
