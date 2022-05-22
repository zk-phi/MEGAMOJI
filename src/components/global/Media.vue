<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    icon: { type: String, default: null },
    title: { type: String, required: true },
  },
});
</script>

<template>
  <div class="media">
    <span v-if="icon" class="icon" :style="{ backgroundImage: `url(${icon})` }" />
    <div class="body">
      <div class="title">
        <slot name="title" />
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.media {
  display: flex;
  color: var(--fg);
  gap: var(--spacingLarge);
}

.title {
  margin-bottom: var(--spacingMedium);
  font-size: var(--fontSizeLarge);
  font-weight: bold;
  line-height: 1;
}

.body {
  font-size: var(--fontSizeMedium);
  line-height: var(--multilineTextLineHeight);
}

.icon {
  display: inline-block;
  width: var(--mediaIconSize);
  height: var(--mediaIconSize);
  background-size: cover;
  border-radius: var(--borderRadiusSmall);
  flex-shrink: 0;
}
</style>
