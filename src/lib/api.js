const API_KEY = "8f4b6f0769434ffba5031fb4bc7c57f8";

export async function getWeatherForecast(lat, lon) {
  const response = await fetch(
    `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=14&key=${API_KEY}`
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not fetch data.");
  }

  const forecastData = [];
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  for (const forecast of data.data) {
    const forecastObject = {
      weekday: weekday[new Date(forecast.valid_date).getDay()].slice(0, 3),
      month: month[new Date(forecast.valid_date).getMonth()],
      date: new Date(forecast.valid_date).getDate(),
      year: new Date(forecast.valid_date).getFullYear(),
      id: forecast.valid_date,
      cityName: data.city_name,
      maxTemp: forecast.high_temp,
      minTemp: forecast.low_temp,
      avgTemp: Math.round(forecast.temp),
      precipitation: forecast.precip,
      weather: forecast.weather.description,
      windSpeed: Math.round(forecast.wind_spd * 3.6),
      pressure: forecast.pres,
      visibility: Math.round(forecast.vis),
      uvIndex: forecast.uv,
      humidity: forecast.rh,
    };
    forecastData.push(forecastObject);
  }
  // console.log(forecastData);
  return { forecastData };
}
