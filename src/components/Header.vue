<script lang="ts">
import { defineComponent } from "vue";
import { NPageHeader, NPopover, NMenu } from "naive-ui";
import IconButton from "./inputs/IconButton.vue";
import Menu from "./icons/Menu.vue";

export default defineComponent({
  components: {
    NPageHeader, IconButton, Menu, NPopover, NMenu,
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
  <NPageHeader
      title="MEGAMOJI"
      subtitle="カスタム絵文字メーカー">
    <template #extra>
      <NPopover trigger="click" placement="bottom-end">
        <template #trigger>
          <IconButton>
            <Menu />
          </IconButton>
        </template>
        <NMenu :options="options" :indent="18" @update:value="handleMenu" />
      </NPopover>
    </template>
  </NPageHeader>
</template>
