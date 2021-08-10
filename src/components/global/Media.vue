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
  margin-bottom: var(--marginSmall);
  font-size: var(--fontSizeLarge);
  line-height: 1;
}

.body {
  font-size: var(--fontSizeMedium);
  line-height: var(--multilineTextLineHeight);
}

.icon {
  display: inline-block;
  width: var(--iconSize);
  height: var(--iconSize);
  background-size: cover;
  border-radius: var(--borderRadiusSmall);
  flex-shrink: 0;
}
</style>
