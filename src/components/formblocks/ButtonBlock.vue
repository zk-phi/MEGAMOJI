<script lang="ts">
export default {
  props: {
    click: { type: Function, required: true },
  },
};
</script>

<template>
  <div class="field">
    <div class="control">
      <button class="button" @click="click">
        <slot />
      </button>
    </div>
  </div>
</template>
