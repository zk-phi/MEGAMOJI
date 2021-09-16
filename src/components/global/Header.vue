<script lang="ts">
import { defineComponent } from "vue";
import Button from "../inputs/Button.vue";

export default defineComponent({
  components: {
    Button,
  },
  methods: {
    openNews() {
      window.open("https://github.com/zk-phi/MEGAMOJI/blob/master/NEWS.markdown");
    },
  },
});
</script>

<template>
  <header class="header">
    <h1 class="title">
      MEGAMOJI
    </h1>
    <p class="description">
      カスタム絵文字をサクッと作れる
      <Button type="text" @click="openNews">
        🎉更新履歴
      </Button>
    </p>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  flex-wrap: wrap;
  color: var(--fg);
  align-items: flex-end;
  gap: var(--marginSmall);
}

.title {
  margin: 0;
  font-size: var(--fontSizeTitle);
  font-weight: bold;
  line-height: 1;
}

.description {
  margin: 0;
  font-size: var(--fontSizeMedium);
  line-height: var(--multilineTextLineHeight);
  color: var(--fg);
}
</style>
