import React from "react";

export default function Toast({message, type, onClose}) {




    return (
        <div className={`toast type--${type}`} role="alert">
            <div className="toastMsg">{message}</div>
            <button className="toastClose" onClick={onClose}>X</button>
        </div>
    )
}