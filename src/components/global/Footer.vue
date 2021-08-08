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
      このページでは Cookie を使用しています (アクセス数などの集計に Google Analytics、エラーの検知に Rollbar)
    </p>
    <p class="p">
      Built with ♡ by zk-phi →
      <Button type="text" @click="donate">
        ☕️コーヒーをおごる
      </Button>
    </p>
  </footer>
</template>

<style scoped>
.footer {
  padding: var(--paddingMedium);
  font-size: var(--fontSizeMedium);
  line-height: 1.5;
  color: var(--fg);
}

.p {
  margin: 0 0 var(--marginSmall);
}
</style>
