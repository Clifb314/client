import React, { useRef } from "react";
import Toast from "./toastnoti";

export default function ToastCont({ data, remove, closeAll }) {
  const display =
    data.length > 0
      ? data.map((noti) => (
          <Toast
            key={noti.id}
            message={noti.message}
            type={noti.type}
            onClose={() => remove(noti.id)}
          />
        ))
      : "";

  const closeBtn =
    data.length > 1 ? (
      <button className="closeAll" onClick={closeAll}>
        Clear
      </button>
    ) : (
      ""
    );

  return (
    <div className="toastCont">
      {display}
      {closeBtn}
    </div>
  );
}
