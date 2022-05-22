<script lang="ts">
import { defineComponent } from "vue";
import Space from "../global/Space.vue";
import Card from "../global/Card.vue";
import Media from "../global/Media.vue";
import Button from "../inputs/Button.vue";
import textSample from "../../samples/text.png";
import imageSample from "../../samples/image.png";
import fukumojiSample from "../../samples/fukumoji.png";
import Image from "../icons/Image.vue";
import Text from "../icons/Text.vue";
import Emoji from "../icons/Emoji.vue";

export default defineComponent({
  components: {
    Card, Space, Button, Media, Image, Text, Emoji,
  },
  data() {
    return {
      textSample,
      imageSample,
      fukumojiSample,
    };
  },
  methods: {
    openLicense() {
      window.open("https://github.com/zk-phi/MEGAMOJI/blob/master/LICENSE.markdown");
    },
  },
});
</script>

<template>
  <Card title="遊び方">
    <Space vertical xlarge>
      <Media :icon="textSample">
        <template #title><Text /> テキスト</template>
        文字からスタンプを作ります。「テキスト」欄になにか入力してみてください。
      </Media>
      <Media :icon="imageSample">
        <template #title><Image /> 画像ファイル</template>
        好きな画像を正方形にトリミングしてスタンプにします。
      </Media>
      <Media :icon="fukumojiSample">
        <template #title><Emoji /> パーツ</template>
        既存の絵文字を合成してスタンプを作ります。
      </Media>
      <Button type="text" @click="openLicense">
        ライセンス表示
      </Button>
    </Space>
  </Card>
</template>
