<script lang="ts" setup>
import CityListItem from "@/ui/settings/components/LocationListItem.vue";
import {useMainState} from "@/state/state";
import Draggable from "vuedraggable";

const state = useMainState();
const {locations$} = state;
</script>

<template>
  <ul>
    <Draggable
        v-model="locations$"
        item-key="id"
        handle=".sort-handle"
        @end="state.save()"
    >
      <template #item="{element}">
        <CityListItem
            :location="element"
            @delete="state.removeLocation(element)"
        />
      </template>
    </Draggable>
  </ul>
</template>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    &:not(:first-child) {
      margin-top: var(--rem);
    }
  }
}
</style>
