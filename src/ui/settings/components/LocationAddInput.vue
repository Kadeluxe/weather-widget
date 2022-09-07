<script lang="ts" setup>
import {ref} from "vue";
import {useMainState, WorldLocation} from "@/state/state";
import IconWrapper from "@/ui/icons/IconWrapper.vue";

const state = useMainState();
const input = ref<HTMLInputElement>(undefined!!);
const inputLocationName = ref("");
const querying = ref(false);

async function submit() {
  if (querying.value) return;
  querying.value = true;

  try {
    const weatherData = await state.queryWeatherByName(inputLocationName.value);
    state.cacheWeatherData(weatherData);

    state.addLocation(
        new WorldLocation(
            weatherData.id,
            weatherData.coord.lat,
            weatherData.coord.lon,
            `${weatherData.location.city}, ${weatherData.location.country}`
        )
    );
  } catch (e) {
    input.value.setCustomValidity("Location not found");
  }

  inputLocationName.value = "";
  querying.value = false;
}

function resetInputError() {
  input.value.setCustomValidity("");
}

</script>

<template>
  <div class="LocationAddInput">
    <label for="input">Add Location:</label>
    <input
        type="text"
        id="input"
        ref="input"
        v-model="inputLocationName"
        @input="resetInputError"
        @keydown.enter="submit"
        :disabled="querying"
    >
    <button @click="submit" :disabled="querying">
      <IconWrapper name="corner-down-left"/>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.LocationAddInput {
  display: grid;
  grid-row-gap: calc(.5 * var(--rem));
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;

  label {
    grid-column: 1 / span 2;
    grid-row: 1;
    font-weight: bold;
  }

  input {
    padding: calc(.25 * var(--rem));
    border: 1px solid black;

    &:invalid {
      border-color: red;
      animation: shake 0.2s ease-in-out 0s 2;
      box-shadow: 0 0 0.5em red;
    }
  }
}

button {
  background: none;
  padding: 0;
  margin-left: calc(.25 * var(--rem));
  border: 0;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
