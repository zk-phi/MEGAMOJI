<script>
import { NPageHeader, NButton } from "naive-ui";

export default {
  components: {
    NPageHeader, NButton,
  },
};
</script>

<template>
  <NPageHeader
      title="MEGAMOJI"
      subtitle="カスタム絵文字メーカー">
    <template #extra>
      <div style="text-align: right;">
        <NButton
            text
            tag="a"
            href="https://github.com/zk-phi/MEGAMOJI/blob/master/NEWS.markdown"
            target="_blank">
          更新履歴
        </NButton>
        {{ " " }}
        <NButton
            text
            tag="a"
            href="https://note.com/zk_phi/n/n3a199c99d6d6"
            target="_blank">
          投げ銭箱
        </NButton>
      </div>
    </template>
  </NPageHeader>
</template>
