<script>
import { NSpace, NPageHeader, NButton } from "naive-ui";

export default {
  components: {
    NSpace, NPageHeader, NButton,
  },
};
</script>

<template>
  <NPageHeader
      title="MEGAMOJI"
      subtitle="カスタム絵文字メーカー">
    <template #extra>
      <NSpace>
        <NButton
            text
            tag="a"
            href="https://github.com/zk-phi/MEGAMOJI/blob/master/NEWS.markdown"
            target="_blank">
          更新履歴
        </NButton>
      </NSpace>
    </template>
  </NPageHeader>
</template>
