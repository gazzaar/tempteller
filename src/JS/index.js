import "../css/style.css";
import { WEATHER_API_KEY } from "./keys.js";

const cityName = document.getElementById("input-city");
const btnGetTemp = document.getElementById("btn-get-temp");
const cityText = document.querySelector(".city-text");
const cityTemp = document.querySelector(".city-temp");

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
      cityText.innerText = `${cityData.name}, ${cityData.country}`;
      cityTemp.innerText = `Temp: ${cityData.tempC}`;
    })
    .catch((err) => {
      cityText.innerText = err.message;
    });

  cityName.value = "";
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
        throw new Error("city name is not valid");
      } else {
        throw new Error("feild to fetch the data");
      }
    }

    const cityData = await data.json();
    const { name, country } = cityData.location;
    const { temp_c: tempC, temp_f: tempF } = cityData.current;

    return {
      name,
      country,
      tempC,
      tempF,
    };
  } catch (err) {
    throw err;
  }
}
