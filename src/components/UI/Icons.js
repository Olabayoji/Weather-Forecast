import React from "react";
import { IoIosSunny, IoMdCloud } from "react-icons/io";
import {
  BsFillCloudFogFill,
  BsFillCloudRainFill,
  BsFillCloudSnowFill,
  BsFillCloudLightningRainFill,
} from "react-icons/bs";

const Icons = (props) => {
  let weatherDesc = props.weather.toLowerCase();
  let icon;
  if (weatherDesc.includes("thunder")) {
    icon = <BsFillCloudLightningRainFill />;
  } else if (weatherDesc.includes("drizzle") || weatherDesc.includes("rain")) {
    icon = <BsFillCloudRainFill />;
  } else if (weatherDesc.includes("cloud")) {
    icon = <IoMdCloud />;
  } else if (weatherDesc.includes("clear")) {
    icon = <IoIosSunny />;
  } else if (weatherDesc.includes("snow")) {
    icon = <BsFillCloudSnowFill />;
  } else {
    icon = <BsFillCloudFogFill />;
  }
  return icon;
};

export default Icons;
