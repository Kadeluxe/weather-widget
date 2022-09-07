<script lang="ts" setup>
import {computed} from "vue";

const icons = import.meta.glob("./icons/*.vue", {eager: true});

const props = defineProps({
  viewBox: {
    type: String,
    default: "0 0 24 24",
  },
  width: {
    type: String,
    default: "24",
  },
  height: {
    type: String,
    default: "24",
  },
  fill: {
    type: String,
    default: "none",
  },
  name: {
    type: String,
    required: true
  }
});

const icon = computed(() => {
  const component: any = icons[`./icons/${props.name}.vue`];
  if (component !== undefined) return component.default;

  return null;
});
</script>

<template>
  <i class="svg-icon">
    <svg
        :height="height"
        :viewBox="viewBox"
        :width="width"
        :fill="fill"
        xmlns="http://www.w3.org/2000/svg"
    >
      <component :is="icon"/>
    </svg>
  </i>
</template>
