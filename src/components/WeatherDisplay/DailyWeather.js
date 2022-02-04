import React from "react";
import classes from "./DailyWeather.module.css";
import Icons from "../UI/Icons";
import { weatherActions } from "../../store/weather-slice";
import { useDispatch } from "react-redux";
const DailyWeather = (props) => {
  return (
    <div onClick={() => props.onShow(props.data)} className={classes.daily}>
      <p className={classes.time}>{props.date}</p>
      <Icons weather={props.icon} />
      <p className={classes.temp}>{props.temp + "°"}</p>
    </div>
  );
};

export default DailyWeather;
