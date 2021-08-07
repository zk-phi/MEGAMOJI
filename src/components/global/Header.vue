<script lang="ts">
import { defineComponent } from "vue";
import { NPopover, NMenu } from "naive-ui";
import IconButton from "../inputs/IconButton.vue";
import Menu from "../icons/Menu.vue";

export default defineComponent({
  components: {
    IconButton, Menu, NPopover, NMenu,
  },
  data() {
    return {
      options: [
        {
          label: "更新履歴",
          key: "https://github.com/zk-phi/MEGAMOJI/blob/master/NEWS.markdown",
        }, {
          label: "ライセンス",
          key: "https://github.com/zk-phi/MEGAMOJI/blob/master/LICENSE.markdown",
        }, {
          label: "投げ銭箱",
          key: "https://note.com/zk_phi/n/n3a199c99d6d6",
        },
      ],
    };
  },
  methods: {
    handleMenu(url: string): void {
      window.open(url);
    },
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
      <NPopover trigger="click" placement="bottom-end">
        <template #trigger>
          <IconButton>
            <Menu />
          </IconButton>
        </template>
        <NMenu :options="options" :indent="18" @update:value="handleMenu" />
      </NPopover>
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
