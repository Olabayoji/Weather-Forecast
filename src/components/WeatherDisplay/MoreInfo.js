import React from "react";
import Modal from "../UI/Modal";
import Card from "../UI/Card";
import { useSelector } from "react-redux";
import classes from "./MoreInfo.module.css";
import { BiWind } from "react-icons/bi";
import { MdVisibility, MdOutlineWater } from "react-icons/md";
import { GiBarbedSun } from "react-icons/gi";
import { FaTemperatureHigh } from "react-icons/fa";
import Gauge from "../UI/Guage";
import Icons from "../UI/Icons";

const MoreInfo = (props) => {
  const info = useSelector((state) => state.weather.moreInfo);
  const day = `${info.weekday}, ${info.date} ${info.month} ${info.year}`;
  // console.log(info);
  return (
    <Modal onClose={props.onClose}>
      <Card>
        <div className={classes.container}>
          <p className={classes.day}>{day}</p>
          <div className={classes.temperature}>
            <FaTemperatureHigh />
            <p className={classes.temp}>{info.avgTemp}°</p>

            <div>
              <div className={classes.element}>
                <p className={classes.header}>Min</p>
                <p>{Math.round(info.minTemp)}°</p>
              </div>
              <Gauge
                value={info.avgTemp}
                min={info.minTemp}
                max={info.maxTemp}
              />
              <div className={classes.element}>
                <p className={classes.header}>Max</p>
                <p>{Math.round(info.maxTemp)}°</p>
              </div>
            </div>
          </div>

          <div className={classes.conditions}>
            <div className={classes.element}>
              <p className={classes.header}>
                <BiWind /> Wind
              </p>
              <p>{info.windSpeed} km/h</p>
            </div>
            <div className={classes.element}>
              <p className={classes.header}>
                {" "}
                <MdOutlineWater /> Humidity
              </p>
              <p>{info.humidity}%</p>
            </div>
            <div className={classes.element}>
              <p className={classes.header}>
                <GiBarbedSun /> Pressure
              </p>
              <p>{info.pressure} hPa</p>
            </div>
            <div className={classes.element}>
              <p className={classes.header}>
                <MdVisibility /> Visibility
              </p>
              <p>{info.visibility} km</p>
            </div>
          </div>
          <button onClick={props.onClose} className="btn">
            Close
          </button>
        </div>
      </Card>
    </Modal>
  );
};

export default MoreInfo;
