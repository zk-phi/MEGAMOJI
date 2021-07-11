<script>
import { NP, NButton } from "naive-ui";

export default {
  components: {
    NP, NButton,
  },
};
</script>

<template>
  <NP>
    このページではアクセス数などの集計に Google Analytics (cookie) を使用しています。オプトアウトアドオンで拒否することができます。
    <NButton
        text
        tag="a"
        href="https://github.com/zk-phi/MEGAMOJI/blob/master/LICENSE.org"
        target="_blank">
      権利表示
    </NButton>
  </NP>
</template>
