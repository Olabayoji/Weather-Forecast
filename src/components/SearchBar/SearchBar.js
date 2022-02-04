import React from "react";
import classes from "./SearchBar.module.css";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { weatherActions } from "../../store/weather-slice";
let autoComplete;
let longitude;
let latitude;

// dynamically load JavaScript files in our html with callback when finished
const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  // when script state is ready and loaded or complete we will call callback
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

// handle when the script is loaded we will assign autoCompleteRef with google maps place autocomplete
function handleScriptLoad(updateQuery, autoCompleteRef) {
  // assign autoComplete with Google maps place one time
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: ["(cities)"] }
  );
  autoComplete.setFields([
    "address_components",
    "formatted_address",
    "geometry",
  ]);

  // add a listener to handle when the place is selected
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery)
  );
}

async function handlePlaceSelect(updateQuery) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  latitude = addressObject.geometry.location.lat();
  longitude = addressObject.geometry.location.lng();
  updateQuery(query);
}

// SearchBar component
const SearchBar = () => {
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);
  const dispatch = useDispatch();
  if (autoCompleteRef.current) {
  }
  useEffect(() => {
    if (latitude) {
      dispatch(
        weatherActions.loadLocation({
          latitude: latitude,
          longitude: longitude,
        })
      );
    }
  }, [dispatch, longitude]);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyA4Fsst30Ob6hbP7aN97VB-l4DOl3MCYzQ&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef)
    );
  }, [dispatch]);
  return (
    <form className={classes.search}>
      <label className="sr-only" htmlFor="city">
        Enter city
      </label>
      <input
        ref={autoCompleteRef}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Enter a City"
        value={query}
      />

      <ul className={classes.suggestions}></ul>
    </form>
  );
};

export default SearchBar;
