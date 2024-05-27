import "../css/style.css";
import { WEATHER_API_KEY, GIGHY_API_KEY } from "./keys.js";

const cityName = document.getElementById("input-city");
const btnGetTemp = document.getElementById("btn-get-temp");
const cityText = document.querySelector(".city-name");
const cityTemp = document.querySelector(".city-temp");
const tempIcon = document.querySelector(".temp-icon");
const humidity = document.querySelector(".humidity");

clearCityData();
btnGetTemp.addEventListener("click", displayData);
cityName.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    displayData();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "/") {
    if (document.activeElement !== cityName) {
      e.preventDefault();
      cityName.focus();
    }
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cityName.value = "";
    cityName.blur();
  }
});

function displayData() {
  if (!cityName.value.trim()) return;
  const data = getData(cityName.value.trim());

  data
    .then((cityData) => {
      let status = true;

      getPhoto(Number(cityData.temp)).catch((err) => {
        console.log(err);
        clearCityData();
        cityText.innerText = err.message;
        return (status = false);
      });

      if (!status) return;

      cityText.innerText = `${cityData.name}, ${cityData.country}`;
      cityTemp.innerText = `${cityData.condText}: ${cityData.tempC}`;
      tempIcon.style.display = "block";
      tempIcon.src = cityData.condIcon;
      humidity.innerText = `Humidity: ${cityData.humidity} `;
    })
    .catch((err) => {
      cityText.innerText = err.message;
      clearCityData();
    });

  cityName.value = "";
}

function clearCityData() {
  tempIcon.style.display = "none";
  cityTemp.innerText = tempIcon.src = humidity.innerText = "";
  document.body.style.backgroundImage = "none";
}

async function getData(city) {
  try {
    const data = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`,
      {
        mode: "cors",
      },
    );

    if (!data?.ok) {
      if (data.status === 400) {
        throw new Error("💥City name is not valid💥");
      } else {
        throw new Error("💥Feild to fetch the data💥");
      }
    }

    const cityData = await data.json();
    const { name, country } = cityData.location;
    const { temp_c: tempC, temp_f: tempF, humidity } = cityData.current;
    const { text: condText, icon: condIcon } = cityData.current.condition;

    return {
      name,
      country,
      tempC,
      tempF,
      condIcon,
      condText,
      humidity,
    };
  } catch (err) {
    throw err;
  }
}

async function getPhoto(temp) {
  let query;

  if (temp < 0) {
    query = "freezing";
  } else if (temp >= 0 && temp < 10) {
    query = "chilly";
  } else if (temp >= 10 && temp < 20) {
    query = "crisp";
  } else if (temp >= 20 && temp < 30) {
    query = "sunny";
  } else {
    query = "heatwave";
  }
  try {
    const data = await fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=${GIGHY_API_KEY}&s=${query}_weather`,
      {
        mode: "cors",
      },
    );

    if (!data.ok) {
      throw new Error("🧨too many requiests");
    }

    const randomGifData = await data.json();
    const gifUrl = `url(${randomGifData.data.images.original.url})`;
    changeBodyBackground(gifUrl);
  } catch (err) {
    throw err;
  }
}

function changeBodyBackground(url) {
  document.body.style.backgroundImage = url;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
}
