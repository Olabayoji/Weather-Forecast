import Layout from "./Layout/Layout";
import React, { useState } from "react";
import SearchBar from "./SearchBar/SearchBar";
import WeatherDisplay from "./WeatherDisplay/WeatherDisplay";
import MoreInfo from "./WeatherDisplay/MoreInfo";
import { useDispatch, useSelector } from "react-redux";
import { weatherActions } from "../store/weather-slice";
import Popup from "./UI/Popup";

const StartingPage = () => {
  const loggedIn = useSelector((state) => state.auth.loginToken);
  const dispatch = useDispatch();
  const [showInfo, setShowInfo] = useState(false);
  const [loginPopup, setLoginPopup] = useState(false);

  const showInfoHandler = (data) => {
    if (loggedIn) {
      setShowInfo(true);
      dispatch(weatherActions.moreInfo(data));
    } else {
      setLoginPopup(true);

      setTimeout(() => {
        setLoginPopup(false);
      }, 5000);
    }
  };
  const hideInfoHandler = () => {
    setShowInfo(false);
  };

  return (
    <Layout>
      {loginPopup && <Popup />}
      {showInfo && <MoreInfo onClose={hideInfoHandler} />}
      <SearchBar />
      <WeatherDisplay onShow={showInfoHandler} />
    </Layout>
  );
};

export default StartingPage;
