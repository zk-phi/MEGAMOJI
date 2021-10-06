<script lang="ts">
import { defineComponent } from "vue";
import Space from "../global/Space.vue";
import Card from "../global/Card.vue";
import Media from "../global/Media.vue";
import Button from "../inputs/Button.vue";
import textSample from "../../samples/text.png";
import imageSample from "../../samples/image.png";
import fukumojiSample from "../../samples/fukumoji.png";

export default defineComponent({
  components: {
    Card, Space, Button, Media,
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
  <Card>
    <Space vertical large>
      <Media title="テキスト" :icon="textSample">
        文字からスタンプを作ります。「テキスト」欄になにか入力してみてください。
      </Media>
      <Media title="画像ファイル" :icon="imageSample">
        好きな画像を正方形にトリミングしてスタンプにします。
      </Media>
      <Media title="パーツ" :icon="fukumojiSample">
        既存の絵文字を合成してスタンプを作ります。
      </Media>
      <Button type="text" @click="openLicense">
        ライセンス表示
      </Button>
    </Space>
  </Card>
</template>
