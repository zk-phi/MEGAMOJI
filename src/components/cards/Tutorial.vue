<script lang="ts">
import { defineComponent } from "vue";
import { NCard, NThing, NSpace, NAvatar, NButton } from "naive-ui";
import textSample from "../../samples/text.png";
import imageSample from "../../samples/image.png";
import fukumojiSample from "../../samples/fukumoji.png";

export default defineComponent({
  components: {
    NCard, NThing, NSpace, NAvatar, NButton,
  },
  data() {
    return {
      textSample,
      imageSample,
      fukumojiSample,
    };
  },
});
</script>

<template>
  <NCard title="使い方">
    <NSpace vertical>
      <NThing>
        <template #avatar>
          <NAvatar :src="textSample" />
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
          <NAvatar :src="imageSample" />
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
          <NAvatar :src="fukumojiSample" />
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
