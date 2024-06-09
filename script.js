const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const weatherDataDiv = document.querySelector(".weather-data");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "63fb19898b3ba126c9934839400f757c"; // API key for OpenWeatherMap API

const getWeatherAnimationClass = (description) => {
    if (description.includes("clear")) {
        return "sunny";
    } else if (description.includes("cloud")) {
        return "cloudy";
    } else if (description.includes("rain")) {
        return "rainy";
    }
    return "";
}

const createWeatherCard = (cityName, weatherItem, index) => {
    const weatherDescription = weatherItem.weather[0].description;
    const weatherIcon = weatherItem.weather[0].icon;
    const weatherAnimationClass = getWeatherAnimationClass(weatherDescription);

    if(index === 0) { // HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherIcon}@4x.png" alt="weather-icon">
                    <h6>${weatherDescription}</h6>
                    <div class="${weatherAnimationClass}"></div>
                </div>`;
    } else { // HTML for the other five day forecast card
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherIcon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                    <div class="${weatherAnimationClass}"></div>
                </li>`;
    }
}

// Add event listeners for search and location buttons
searchButton.addEventListener("click", () => {
    const cityName = cityInput.value;
    if(cityName) {
        getWeatherDataByCityName(cityName);
    }
});

locationButton.addEventListener("click", () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            getWeatherDataByCoordinates(latitude, longitude);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

const getWeatherDataByCityName = (cityName) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const cityName = data.city.name;
            const weatherList = data.list;
            updateWeatherData(cityName, weatherList);
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

const getWeatherDataByCoordinates = (latitude, longitude) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const cityName = data.city.name;
            const weatherList = data.list;
            updateWeatherData(cityName, weatherList);
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

const updateWeatherData = (cityName, weatherList) => {
    currentWeatherDiv.innerHTML = createWeatherCard(cityName, weatherList[0], 0);
    weatherCardsDiv.innerHTML = weatherList.slice(1, 6).map((weatherItem, index) => {
        return createWeatherCard(cityName, weatherItem, index + 1);
    }).join("");
    weatherDataDiv.classList.add("show");
}
