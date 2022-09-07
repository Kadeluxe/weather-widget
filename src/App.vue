<script lang="ts" setup>
import MainView from "@/ui/main/views/MainView.vue";
import SettingsView from "@/ui/settings/views/SettingsView.vue";
import {useMainState, ViewType} from "@/state/state";
import {onMounted, ref, watch} from "vue";
import IconWrapper from "@/ui/icons/IconWrapper.vue";

const state = useMainState();
const view$ = state.view$;
const wrapper = ref<HTMLElement>(undefined!!);

state.load();

// prevent flicker when switching from main -> settings view
// (settings view is much more compact vertically)
watch(view$, (v: ViewType) => {
  const el = wrapper.value;

  if (v == ViewType.Settings) {
    const box = el.getBoundingClientRect();

    el.style.setProperty("--width", `${box.width}px`);
    el.style.setProperty("--height", `${box.height}px`);

    el.classList.add("fix-size");
  } else {
    el.classList.remove("fix-size");
  }
});

function toggleSettings() {
  state.toggleSettings();
}

onMounted(() => {
  if (state.isEmpty$.value) state.queryUserGeolocation();
});

</script>

<template>
  <div id="wrapper" ref="wrapper">
    <button class="settings-icon" @click="toggleSettings()">
      <IconWrapper name="settings" v-if="view$ === ViewType.Main"/>
      <IconWrapper name="x" v-else/>
    </button>

    <MainView v-if="view$ === ViewType.Main"/>
    <SettingsView v-else/>
  </div>
</template>

<style lang="css" src="./assets/styles/normalize.css"/>
<style lang="scss" src="./assets/styles/global.scss"/>

<style lang="scss" scoped>
#wrapper {
  --width: 0;
  --height: 0;

  &.fix-size {
    width: var(--width);
    min-height: var(--height);
  }

  .settings-icon {
    z-index: 1;
    position: absolute;
    right: var(--root-padding);
    top: var(--root-padding);
    font-size: 24px;

    padding: 0;
    display: inline-flex;
  }
}
</style>
