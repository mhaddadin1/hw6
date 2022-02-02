// variables
const searchCities = [];
// functions

// api fetch
function handleCoords(searchCity) {
  const fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

  fetch(fetchUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("There was an issue with the response");
      }
    })
    .then(function (data) {
      handleCurrentWeather(data.coord, data.name);
    })
    .catch((error) => {
      console.log("Error");
    });
}

// get city coordinates
function handleCurrentWeather(coordinates, city) {
  const lat = coordinates.lat;
  const lon = coordinates.lon;

  const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      displayCurrentWeather(data.current, city);
      displayFiveDayWeather(data.daily);
    });
}

// display current day weather for city
function displayCurrentWeather(currentCityData, cityName) {
  let weatherIcon = `https://openweathermap.org/img/wn/${currentCityData.weather[0].icon}.png`;

  document.querySelector(
    "#currentWeather"
  ).innerHTML = `<h2>${cityName} ${moment
    .unix(currentCityData.dt)
    .format("MMM Do YY")} <img src="${weatherIcon}"></h2> <div>Temp: ${
    currentCityData.temp
  } \xB0F</div><div>Wind: ${
    currentCityData.wind_speed
  } MPH</div><div>Humidity: ${
    currentCityData.humidity
  } %</div><div>UV Index: <span id="uvColor">${
    currentCityData.uvi
  }</span></div>`;
  let uvIndex = currentCityData.uvi;
  if (uvIndex >= 0 && uvIndex < 3) {
    document.querySelector("#uvColor").classList.add("uvFav");
  } else if (uvIndex >= 3 && uvIndex < 5) {
    document.querySelector("#uvColor").classList.add("uvMod");
  } else if (uvIndex > 5) {
    document.querySelector("#uvColor").classList.add("uvSev");
  }
}

// display five day weather forecast for selected city
function displayFiveDayWeather(fiveDayCityData) {
  const cityData = fiveDayCityData.slice(1, 6);
  document.querySelector("#fiveDayWeather").innerHTML = "";

  cityData.forEach((day) => {
    let weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

    document.querySelector(
      "#fiveDayWeather"
    ).innerHTML += `<div class="bg-primary col-sm m-1 p-2 card"><div>${moment
      .unix(day.dt)
      .format(
        "MMM Do YY"
      )}</div> <div><img src="${weatherIcon}"></div><div>Temp: ${
      day.temp.day
    } \xB0F</div><div>Wind: ${day.wind_gust} MPH</div><div>Humidity: ${
      day.humidity
    } %</div>`;
  });
}

// search for city and search history
function handleFormSubmit(event) {
  document.querySelector("#searchHistory").innerHTML = "";
  event.preventDefault();

  const city = document.querySelector("#searchInput").value.trim();
  searchCities.push(city.toLowerCase());

  const filteredCities = searchCities.filter((city, index) => {
    return searchCities.indexOf(city) === index;
  });

  filteredCities.forEach((city) => {
    document.querySelector(
      "#searchHistory"
    ).innerHTML += `<button data-city="${city}" class="w-100 d-block my-2">${city}</button>`;
  });
  handleCoords(city);
}

function handleHistory(event) {
  const city = event.target.getAttribute("data-city");
  handleCoords(city);
}

// event listeners
document
  .querySelector("#searchForm")
  .addEventListener("submit", handleFormSubmit);
document
  .querySelector("#searchHistory")
  .addEventListener("click", handleHistory);
