import {computed, ref} from "vue";
import OpenWeatherMap from "openweathermap-ts";
import {toWeatherData, type WeatherData} from "@/state/weather";

export const enum ViewType {
  Main,
  Settings,
}

export class WorldLocation {
  constructor(
    public id: number,
    public lat: number,
    public lon: number,
    public name?: string
  ) {

  }
}

const AppID = "eb37fe00ae25b4b96eff70c8d3addabf";

const enum LocalStorage {
  Locations = "Locations",
}

export class MainState {
  #openWeather = new OpenWeatherMap({
    apiKey: AppID,
    units: "metric"
  });

  view$ = ref(ViewType.Main);
  locations$ = ref([] as WorldLocation[]);

  #cache$ = ref(new Map<number, WeatherData>());

  isEmpty$ = computed(() => this.locations$.value.length == 0);

  load() {
    const serialized = localStorage.getItem(LocalStorage.Locations);
    if (!serialized) return;

    this.locations$.value = JSON.parse(serialized);
  }

  save() {
    localStorage.setItem(LocalStorage.Locations, JSON.stringify(this.locations$.value));
  }

  addLocation(location: WorldLocation) {
    if (this.locations$.value.findIndex(it => it.id == location.id) != -1) return;

    this.locations$.value.push(location);

    this.save();
  }

  removeLocation(location: WorldLocation) {
    const idx = this.locations$.value.findIndex(it => it.id == location.id);
    if (idx == -1) return;

    this.locations$.value.splice(idx, 1);
    this.#cache$.value.delete(location.id);

    this.save();
  }

  cacheWeatherData(weatherData: WeatherData) {
    this.#cache$.value.set(weatherData.id, weatherData);
  }

  async fetchWeatherData(cityId: number) {
    const map = this.#cache$.value;

    if (!map.has(cityId)) {
      const res = await this.#openWeather.getCurrentWeatherByCityId(cityId);
      map.set(res.id, toWeatherData(res));
    }

    return map.get(cityId)!!;
  }

  async queryWeatherByName(name: string) {
    return toWeatherData(await this.#openWeather.getCurrentWeatherByCityName({cityName: name}));
  }

  async queryWeatherByLocation(lat: number, lon: number) {
    return toWeatherData(await this.#openWeather.getCurrentWeatherByGeoCoordinates(lat, lon));
  }

  async queryUserGeolocation() {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const {latitude, longitude} = position.coords;

        try {
          const weatherData = await this.queryWeatherByLocation(latitude, longitude);
          this.cacheWeatherData(weatherData);

          this.addLocation(
            new WorldLocation(
              weatherData.id,
              weatherData.coord.lat,
              weatherData.coord.lon,
              `${weatherData.location.city}, ${weatherData.location.country}`
            )
          );
        } catch (e) {
          console.error(e);
        }
      },
      () => undefined,
    );
  }

  toggleSettings() {
    this.view$.value = this.view$.value == ViewType.Main ? ViewType.Settings : ViewType.Main;
  }
}

const mainState = new MainState();

export const useMainState = () => mainState;
