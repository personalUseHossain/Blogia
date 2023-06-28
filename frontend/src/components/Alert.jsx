import React from "react";
import "../css/Alert.css";

export default function Alert(props) {
  return (
    <>
      <div className="alert">
        <span
          className="closebtn"
          onclick="this.parentElement.style.display='none';"
        >
          &times;
        </span>
        {props.txt}
      </div>
    </>
  );
}
