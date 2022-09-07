<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {useMainState} from "@/state/state";
import {emptyWeatherData, type WeatherData} from "@/state/weather";
import IconWrapper from "@/ui/icons/IconWrapper.vue";

const props = defineProps<{ cityId: number }>();

const state = useMainState();
const data = ref<WeatherData>(emptyWeatherData());

const loaded = ref(false);
const error = ref(false);

onMounted(async () => {
  try {
    data.value = await state.fetchWeatherData(props.cityId);
    loaded.value = true;
  } catch (e) {
    error.value = true;
  }
});

const windDegrees = computed(() => `${data.value.wind.deg}deg`);

</script>

<template>
  <div class="LocationReport">
    <span class="location">{{ data.location.city }}, {{ data.location.country }}</span>
    <div class="overview">
      <span class="icon">
        <img :src="data.icon" v-if="data.icon"/>
      </span>
      <span class="temp">{{ data.temp.actual }}°C</span>
    </div>
    <div class="summary">
      Feels like {{ data.temp.feelsLike }}°C. {{ data.description }}
    </div>
    <div class="details">
      <table>
        <tr>
          <td>
            <IconWrapper name="navigation-2" width="1em" height="1em" fill="black" class="wind-direction"/>
            {{ data.wind.speed.toFixed(1) }} m/s {{ data.wind.direction }}
          </td>
          <td>{{ data.pressure }}hPa</td>
        </tr>
        <tr>
          <td>Humidity: {{ data.humidity }}%</td>
          <td>Dew point: {{ data.dewPoint }}°C</td>
        </tr>
        <tr>
          <td>Visibility: {{ data.visibility.toFixed(1) }}km</td>
        </tr>
      </table>
    </div>
    <div class="loading-overlay" v-if="!loaded || error">
      {{ error ? "Couldn't load weather data" : "Loading..." }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.LocationReport {
  display: flex;
  flex-direction: column;
  gap: var(--rem);
  position: relative;

  .location {
    font-weight: bold;
  }

  .overview {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .icon {
      width: 75px;
      height: 75px;

      > img {
        width: 100%;
        height: 100%;
      }
    }

    .temp {
      font-size: 32px;
      font-weight: bold;
    }
  }

  .details {
    font-size: 14px;

    .wind-direction {
      --deg: v-bind('windDegrees');

      &:deep(svg) {
        transform: rotate(var(--deg));
      }
    }

    td {
      &:not(:first-child) {
        padding-left: calc(.25 * var(--rem));
      }
    }
  }

  .loading-overlay {
    background: white;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
