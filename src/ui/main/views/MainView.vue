<script lang="ts" setup>
import LocationReport from "@/ui/main/components/LocationReport.vue";
import IconWrapper from "@/ui/icons/IconWrapper.vue";
import {useMainState} from "@/state/state";

const state = useMainState();
const {locations$} = state;
</script>

<template>
  <div class="MainView">
    <template v-if="locations$.length > 0">
      <LocationReport
          class="LocationReport"
          v-for="location in locations$"
          :key="location.id"
          :city-id="location.id"
      />
    </template>
    <template v-else>
      <span class="location-prompt">Click <a @click.prevent="state.queryUserGeolocation()" href="">here</a> to share your geolocation or add cities manually in settings.</span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.MainView {
  display: flex;
  flex-direction: column;

  .LocationReport {
    &:not(:first-child) {
      margin-top: calc(2 * var(--rem))
    }
  }

  .location-prompt {
    width: calc(100% - var(--root-padding));
  }
}
</style>
