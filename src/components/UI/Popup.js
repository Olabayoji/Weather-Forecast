import React from "react";
import classes from "./Popup.module.css";
import { AiFillWarning } from "react-icons/ai";

const Popup = () => {
  return (
    <div className={classes.popup}>
      <p>
        <AiFillWarning /> Kindly login to view more forecast information
      </p>
    </div>
  );
};

export default Popup;
