<script lang="ts">
import { NCard, NThing, NSpace, NAvatar, NButton } from "naive-ui";

export default {
  components: {
    NCard, NThing, NSpace, NAvatar, NButton,
  },
};
</script>

<template>
  <NCard title="使い方">
    <NSpace vertical>
      <NThing>
        <template #avatar>
          <NAvatar src="assets/samples/text.png" />
        </template>
        <template #header>
          テキスト絵文字
        </template>
        <template #description>
          文字からスタンプを作ります。「テキスト」欄になにか入力してみてください。
        </template>
      </NThing>
      <NThing>
        <template #avatar>
          <NAvatar src="assets/samples/image.png" />
        </template>
        <template #header>
          画像絵文字
        </template>
        <template #description>
          好きな画像を正方形にトリミングしてスタンプにします。
        </template>
      </NThing>
      <NThing>
        <template #avatar>
          <NAvatar src="assets/samples/fukumoji.png" />
        </template>
        <template #header>
          キメラ絵文字
        </template>
        <template #description>
          既存の絵文字を合成してスタンプを作ります。
          <NButton
              text
              tag="a"
              href="https://github.com/zk-phi/MEGAMOJI/blob/master/LICENSE.markdown"
              target="_blank">
            ライセンス表示
          </NButton>
        </template>
      </NThing>
    </NSpace>
  </NCard>
</template>
