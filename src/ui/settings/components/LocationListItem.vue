<script lang="ts" setup>
import type {WorldLocation} from "@/state/state";
import IconWrapper from "@/ui/icons/IconWrapper.vue";

const emit = defineEmits<{ e: "delete" }>();
const props = defineProps<{ location: WorldLocation }>();

</script>

<template>
  <li>
    <span class="sort-handle"><IconWrapper name="menu"/></span>
    <span class="name">{{ props.location.name }}</span>
    <button class="remove" @click="$emit('delete')">
      <IconWrapper name="trash-2"/>
    </button>
  </li>
</template>

<style lang="scss" scoped>
li {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #f0f0f0;
  padding: calc(.25 * var(--rem));

  .name {
    margin-left: var(--rem);
    flex: 1;
  }

  span, button {
    display: inline-flex;
  }
}
</style>
