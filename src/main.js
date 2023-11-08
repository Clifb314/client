import { React, useEffect, useState } from "react";
import ToastCont from "./components/toastCont";
import GameDisp from "./components/gameDisp";
import Scoreboard from "./components/scoreboard";
import { v4 as uuidv4 } from "uuid";

export default function Main() {
  const [toasts, setToasts] = useState([]);

  function addToast(msg, type) {
    const newToast = {
      id: uuidv4(),
      message: msg,
      type,
    };
    if (toasts.length < 1) {
      setToasts([newToast])
    } else if (toasts.length < 3) {
      setToasts((prev) => [...prev, newToast]);
    } else {
      let newList = [...toasts];
      newList.shift();
      newList.push(newToast);
      setToasts(newList);
    }

    setTimeout(() => {
      closeToast(newToast.id);
    }, 50000);
  }

  function closeToast(id) {
    if (toasts.length < 2) {
      setToasts([])
      return
    }
    const newList = toasts.filter((toast) => toast.id !== id);
    setToasts(newList);
  }

  function closeAllToasts() {
    setToasts([]);
    console.log(toasts)
  }

  useEffect(() => {
    addToast('Welcome!', "win")

    return closeAllToasts()
  }, [])


  return (
    <div className="main">
      <GameDisp newNoti={addToast} />
      <Scoreboard />
      <ToastCont data={toasts} remove={closeToast} closeAll={closeAllToasts} />
    </div>
  );
}
