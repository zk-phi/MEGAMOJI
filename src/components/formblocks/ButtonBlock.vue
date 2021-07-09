<script>
export default {
  props: ["click"]
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
