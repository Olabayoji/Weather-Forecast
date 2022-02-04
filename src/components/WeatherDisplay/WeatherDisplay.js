import React, { useEffect, useState } from "react";
import classes from "./WeatherDisplay.module.css";
import Icons from "../UI/Icons";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../UI/Loader";
import useHttp from "../../hooks/use-http";
import { getWeatherForecast } from "../../lib/api";
import Card from "../UI/Card";
import DailyWeather from "./DailyWeather";
import { weatherActions } from "../../store/weather-slice";
import clear from "../../assets/clear.jpeg";
import cloudy from "../../assets/cloudy.jpeg";
import rain from "../../assets/rain.jpeg";
import thunder from "../../assets/thunder.jpeg";
import snow from "../../assets/snow.jpeg";

const WeatherDisplay = (props) => {
  const dispatch = useDispatch();
  const coordinates = useSelector((state) => state.weather.coordinates);
  // useHttp custom hook  instance for when the user searches for location
  const [shareLocation, setShareLocation] = useState(true);
  const {
    sendRequest: searchRequest,
    data: dataRequest,
    status: statusRequest,
    error: errorRequest,
  } = useHttp(getWeatherForecast);

  useEffect(() => {
    // if there's a coordinate save into users local storage
    if (coordinates.longitude) {
      searchRequest(coordinates.latitude, coordinates.longitude);
    }
    // ask for permission to get user location
    else {
      navigator.geolocation.getCurrentPosition(
        // run if user accepts to share location
        (location) => {
          const lat = location.coords.latitude;
          const lon = location.coords.longitude;
          dispatch(
            weatherActions.loadLocation({
              latitude: lat,
              longitude: lon,
            })
          );
        },
        // runs if user fails to share location
        (error) => setShareLocation(false)
      );
    }
  }, [
    coordinates.latitude,
    coordinates.longitude,
    searchRequest,
    coordinates,
    dispatch,
  ]);

  // if user fails to share location
  if (!shareLocation) {
    return (
      <div className="centered">
        <p>Permission to get current location denied. Kindly enter a city</p>
      </div>
    );
  }

  if (
    statusRequest === "pending" ||
    coordinates.latitude === null ||
    dataRequest === null
  ) {
    return (
      <div className="centered">
        <Loader />
      </div>
    );
  }

  if (errorRequest) {
    return (
      <div className="centered">
        <p>{errorRequest}</p>
      </div>
    );
  }
  // console.log(errorRequest, dataRequest, statusRequest);

  // current weather  = to the first object in the array
  let currentWeatherData = dataRequest.forecastData[0];
  let currentWeatherDesc = currentWeatherData.weather.toLowerCase();

  // 7 day forecast card
  let forecast = dataRequest.forecastData.map((day) => {
    const date = day.weekday;
    const icon = day.weather;
    const temp = day.avgTemp;
    const days = day;
    const data = day;
    return (
      <DailyWeather
        onShow={props.onShow}
        day={days}
        key={day.id}
        date={date}
        icon={icon}
        temp={temp}
        data={data}
      />
    );
  });

  // Date
  const currentDate = `${currentWeatherData.weekday}, ${currentWeatherData.date} ${currentWeatherData.month} ${currentWeatherData.year}`;

  // Dynamic Background Image
  const weather = currentWeatherData.weather.toLowerCase();
  let style = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${cloudy})`,
  };
  if (weather.includes("thunder")) {
    style = { backgroundImage: `url(${thunder})` };
  } else if (weather.includes("drizzle") || weather.includes("rain")) {
    style = {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${rain})`,
    };
  } else if (weather.includes("clear")) {
    style = {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${clear})`,
    };
  } else if (weather.includes("snow")) {
    style = {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${snow})`,
    };
  }
  return (
    <React.Fragment>
      <div style={style} className={classes["weather-display"]}>
        <div className="centered">
          <p className={classes.date}>{currentDate}</p>
          <p className={classes.city}>{currentWeatherData.cityName}</p>
        </div>
        <p className={classes.temp}>{currentWeatherData.avgTemp + "°"}</p>
        <div className="centered">
          <Icons weather={currentWeatherDesc} />
          <p className={classes.condition}>{currentWeatherData.weather}</p>
        </div>
      </div>

      <Card>
        <p className={classes.description}>14-Day Forecast</p>
        <hr />
        <div className={classes.inner}>{forecast}</div>
      </Card>
    </React.Fragment>
  );
};

export default WeatherDisplay;
