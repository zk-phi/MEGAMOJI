<script lang="ts">
import { defineComponent } from "vue";
import { NP } from "naive-ui";

export default defineComponent({
  components: {
    NP,
  },
});
</script>

<template>
  <NP>
    このページでは Cookie (アクセス数などの集計に Google Analytics、エラーの検知に Rollbar) を使用しています。
  </NP>
</template>
