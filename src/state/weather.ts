import capitalize from "lodash/capitalize";
import type {CurrentResponse} from "openweathermap-ts/dist/types";

export interface WeatherData {
  id: number;
  location: {
    city: string;
    country: string;
  };
  description: string;
  temp: {
    actual: number;
    feelsLike: number;
  };
  wind: {
    speed: number;
    deg: number;
    direction: string;
  };
  pressure: number;
  humidity: number;
  dewPoint: number;
  visibility: number;
  icon?: string;
  coord: {
    lat: number;
    lon: number;
  };
}

export function toWeatherData(data: CurrentResponse): WeatherData {
  return {
    id: data.id,
    location: {
      country: data.sys.country,
      city: data.name,
    },
    description: `${capitalize(data.weather[0].description)}.`,
    temp: {
      actual: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like)
    },
    wind: {
      speed: data.wind.speed,
      deg: data.wind.deg,
      direction: degreesToCompass(data.wind.deg),
    },
    pressure: data.main.pressure,
    humidity: data.main.humidity,
    dewPoint: Math.round(data.main.temp - (100 - data.main.humidity) / 5),
    visibility: data.visibility / 1000,
    icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    coord: {
      ...data.coord,
    }
  };
}

export const emptyWeatherData = (): WeatherData => ({
  id: -1,
  location: {
    city: "N/A",
    country: "N/A",
  },
  description: "Loading...",
  temp: {
    actual: 0,
    feelsLike: 0,
  },
  wind: {
    speed: 0,
    deg: 0,
    direction: "N/A",
  },
  pressure: 0,
  humidity: 0,
  dewPoint: 0,
  visibility: 0,
  icon: undefined,
  coord: {
    lat: 0,
    lon: 0,
  }
});

function degreesToCompass(num: number) {
  const val = Math.floor((num / 22.5) + 0.5);
  const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[val % 16];
}
