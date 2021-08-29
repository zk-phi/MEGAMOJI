<script lang="ts">
import { defineComponent } from "vue";
import Button from "../inputs/Button.vue";

export default defineComponent({
  components: {
    Button,
  },
  methods: {
    donate() {
      window.open("https://note.com/zk_phi/n/n3a199c99d6d6");
    },
  },
});
</script>

<template>
  <footer class="footer">
    <p class="p">
      このページでは Cookie (アクセス数などの集計に Google Analytics、エラーの検知に Rollbar) を使用しています。
    </p>
    <p class="p">
      Built with ♡ by zk-phi
      <Button type="text" @click="donate">
        🎁投げ銭箱
      </Button>
    </p>
  </footer>
</template>

<style scoped>
.footer {
  font-size: var(--fontSizeMedium);
  line-height: var(--multilineTextLineHeight);
  color: var(--fg);
}

.p {
  margin: 0 0 var(--marginXSmall);
}
</style>
