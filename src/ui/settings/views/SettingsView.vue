<script lang="ts" setup>
import {onKeyStroke} from "@vueuse/core";
import CityList from "@/ui/settings/components/LocationList.vue";
import LocationAddInput from "@/ui/settings/components/LocationAddInput.vue";
import {useMainState} from "@/state/state";

const state = useMainState();
const {isEmpty$} = state;

onKeyStroke("Escape", () => state.toggleSettings());
</script>

<template>
  <div class="SettingsView">
    <h1>Settings</h1>
    <CityList class="city-list" v-if="!isEmpty$"/>
    <LocationAddInput/>
  </div>
</template>

<style lang="scss" scoped>
.SettingsView {
  display: flex;
  flex-direction: column;
  gap: calc(2 * var(--rem));

  h1 {
    font-size: var(--rem);
    font-weight: bold;
    margin: 0;
  }
}
</style>
