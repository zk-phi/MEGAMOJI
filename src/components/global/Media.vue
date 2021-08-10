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
        {{ title }}
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.media {
  display: flex;
  color: var(--fg);
  gap: var(--marginMedium);
}

.title {
  line-height: 1;
  font-size: var(--fontSizeLarge);
  margin-bottom: var(--marginSmall);
}

.body {
  line-height: var(--multilineTextLineHeight);
  font-size: var(--fontSizeMedium);
}

.icon {
  display: inline-block;
  flex-shrink: 0;
  height: var(--iconSize);
  width: var(--iconSize);
  background-size: cover;
  border-radius: var(--borderRadiusSmall);
}
</style>
