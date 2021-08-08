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
    }
  },
});
</script>

<template>
  <header class="header">
    <h1 class="title">
      MEGAMOJI
    </h1>
    <h2 class="subtitle">
      カスタム絵文字メーカー
    </h2>
    <span class="right">
      <Button type="text" @click="openNews">
        更新履歴
      </Button>
    </span>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  padding: var(--paddingMedium);
  line-height: 1;
  border-bottom: 1px solid var(--border);
  align-items: center;
}

.title {
  display: inline;
  margin: 0 var(--marginMedium) 0 0;
  font-size: var(--fontSizeLarge);
  font-weight: bold;
  vertical-align: middle;
}

.subtitle {
  display: inline;
  margin: 0;
  font-size: var(--fontSizeMedium);
  font-weight: normal;
  vertical-align: middle;
}

.right {
  margin-left: auto;
}
</style>
