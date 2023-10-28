import {React, useState} from "react";
import ToastCont from "./components/toastCont";
import GameDisp from "./components/gameDisp";
import Scoreboard from "./components/scoreboard";
import {v4 as uuidv4} from 'uuid'

export default function Main() {
    const [toasts, setToasts] = useState([])


    function addToast(msg, type) {
        const newToast = {
            id: uuidv4(),
            message: msg,
            type
        }
        if (toasts.length < 6) {
            setToasts(prev => [newToast, prev])
        } else {
            let newList = [...toasts]
            newList.pop()
            newList.unshift(newToast)
            setToasts(newList)
        }

        setTimeout(() => {
            closeToast(newToast.id)
        }, 5000)
    }
    
    function closeToast(id) {
        const newList = toasts.filter(toast => toast.id !== id)
        setToasts(newList)
    }

    function closeAllToasts() {
        setToasts([])
    }


    return (
        <div className="main">
            <GameDisp newNoti={addToast} />
            <Scoreboard />
            <ToastCont data={toasts} remove={closeToast} closeAll={closeAllToasts} />
        </div>
    )



}