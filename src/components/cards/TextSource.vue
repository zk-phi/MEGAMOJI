<script lang="ts">
import { defineComponent } from "vue";
import Analytics from "../../utils/analytics";
import FontSelectBlock from "../formblocks/FontSelectBlock.vue";
import FontColorSelectBlock from "../formblocks/FontColorSelectBlock.vue";
import OutlineBlock from "../formblocks/OutlineBlock.vue";
import Checkbox from "../inputs/Checkbox.vue";
import NumberInput from "../inputs/Number.vue";
import Textarea from "../inputs/Textarea.vue";
import ToggleButton from "../inputs/ToggleButton.vue";
import Fieldset from "../inputs/Fieldset.vue";
import Input from "../inputs/Input.vue";
import Space from "../global/Space.vue";
import Card from "../global/Card.vue";
import Grid from "../global/Grid.vue";
import Button from "../inputs/Button.vue";
import GridItem from "../global/GridItem.vue";
import AlignJustify from "../icons/AlignJustify.vue";
import AlignCenter from "../icons/AlignCenter.vue";
import AlignLeft from "../icons/AlignLeft.vue";
import AlignRight from "../icons/AlignRight.vue";

import { ColorStop } from "../../types";
import { absColor } from "../../utils/color";
import { makeTextImage } from "../../utils/textimage";
import { jaToRoomaji } from "../../utils/jaToRoomaji";
import { EMOJI_SIZE } from "../../constants/emoji";
import fonts from "../../constants/fonts";

export default defineComponent({
  components: {
    FontSelectBlock,
    FontColorSelectBlock,
    OutlineBlock,
    Fieldset,
    Checkbox,
    Textarea,
    Input,
    Number: NumberInput,
    Grid,
    GridItem,
    Space,
    Card,
    ToggleButton,
    AlignJustify,
    AlignCenter,
    AlignLeft,
    AlignRight,
    Button,
  },
  props: {
    show: { type: Boolean, required: true },
    emojiSize: { type: Number, default: 256 },
  },
  emits: ["render"],
  data() {
    return {
      conf: {
        /* basic */
        content: "",
        align: "stretch",
        color: "#d6b600",
        gradient: [] as ColorStop[],
        outlines: [] as string[],
        gradientPos: [0, 0, 0, 100],
        gradientMarker: false,
        font: `normal 1em '${fonts[0].fonts[0].family}'`,
        /* advanced */
        lineSpacing: 0,
        padding: 0,
        letterSpacing: 0,
        margin: 0.025,
        monospaceLayoutEnabled: false,
        cellAlign: "center",
        cellWidthBasis: "line",
        filename: "",
        fontReady: false,
      },
      showDetails: false,
      /* internals */
      running: false,
      dirty: false,
      originalHiragana: "",
      renderTimeout: null as ReturnType<typeof setTimeout> | null,
      nameTimeout: null as ReturnType<typeof setTimeout> | null,
      errorReading: false,
    };
  },
  computed: {
    absoluteOutlines(): string[] {
      return this.conf.outlines.map((outline) => absColor(outline, this.conf.color));
    },
    absoluteGradient(): { color: string, pos: number }[] {
      return this.conf.gradient.map((cs) => ({
        color: absColor(cs.color, this.conf.color),
        pos: cs.pos,
      }));
    },
    currentFilename(): string {
      const filename = this.conf.filename?.replace(/\n/g, "");
      const romaji = jaToRoomaji(this.conf.content);
      return filename ? `${filename}.png` : `${romaji}.png`;
    },
    currentFilename2(): string {
      const filename = this.conf.filename?.replace(/\n/g, "");
      const romaji = jaToRoomaji(this.conf.content);
      return filename || romaji;
    },
  },
  watch: {
    conf: {
      handler(): void {
        Analytics.changeFont(this.conf.font);
        this.render(true);
        this.scheduleNameUpdate();
      },
      deep: true,
    },
    emojiSize: {
      handler(): void {
        this.render(true);
      },
    },
  },
  mounted() {
    Analytics.changeFont(this.conf.font);
  },
  methods: {
    async getReading(text: string): Promise<string> {
      try {
        this.errorReading = true;
        return text; // 入力テキストを返す
      } catch (error) {
        this.errorReading = true;
        return text; // 失敗した場合は入力テキストを返す
      }
    },
    scheduleNameUpdate(): void {
      if (this.nameTimeout) clearTimeout(this.nameTimeout);

      if (!this.errorReading) {
        this.updateName();
      } else {
        this.updateName();
      }
    },
    async updateName(): Promise<void> {
      this.render();
    },
    render(dirty?: boolean): void {
      if (dirty) {
        this.dirty = true;
      }
      if (!this.dirty || this.running || !this.conf.fontReady) {
        return;
      }
      this.running = true;
      this.dirty = false;

      if (this.conf.content) {
        const canvas = makeTextImage(
          this.conf.content,
          this.conf.color,
          this.conf.font,
          this.emojiSize || EMOJI_SIZE,
          this.conf.align,
          Number(this.conf.lineSpacing),
          this.absoluteOutlines,
          this.absoluteGradient,
          Number(this.conf.padding),
          this.conf.gradientPos,
          this.conf.gradientMarker,
          Number(this.conf.letterSpacing) || undefined,
          Number(this.conf.margin) || undefined,
          this.conf.monospaceLayoutEnabled,
          this.conf.cellAlign,
          this.conf.cellWidthBasis,
        );
        const name = this.conf.filename?.replace(/\n/g, "") || jaToRoomaji(this.conf.content).replace(/\n/g, "");
        this.$emit("render", canvas, name);
      }

      window.setTimeout(() => {
        this.running = false;
        this.render();
      }, 50);
    },
  },
});
</script>

<template>
  <Card v-if="show">
    <Grid :columns="[[450, 1], [Infinity, 3]]" spaced>
      <GridItem>
        <FontSelectBlock
            v-model="conf.font"
            v-model:fontReady="conf.fontReady"
            :show-details="showDetails" />
      </GridItem>
      <GridItem :span="2">
        <Space vertical xlarge full>
          <Fieldset label="テキスト (改行可)">
            <Space vertical full>
              <Textarea
                  v-model="conf.content"
                  name="テキスト"
                  block
                  autofocus
                  :rows="5" />
              <Space small>
                <ToggleButton
                    v-model="conf.align"
                    name="両端揃え"
                    size="smallIcon"
                    value="stretch">
                  <AlignJustify />
                </ToggleButton>
                <ToggleButton
                    v-model="conf.align"
                    name="中央揃え"
                    size="smallIcon"
                    value="center">
                  <AlignCenter />
                </ToggleButton>
                <ToggleButton
                    v-model="conf.align"
                    name="左揃え"
                    size="smallIcon"
                    value="left">
                  <AlignLeft />
                </ToggleButton>
                <ToggleButton
                    v-model="conf.align"
                    name="右揃え"
                    size="smallIcon"
                    value="right">
                  <AlignRight />
                </ToggleButton>
              </Space>
              <Space small>
                <ToggleButton
                    v-model="conf.monospaceLayoutEnabled"
                    name="均等幅文字モード"
                    :value="true">
                  {{ "均等幅文字モード" }}
                </ToggleButton>
              </Space>
              <Fieldset v-if="conf.monospaceLayoutEnabled" label="セル内配置">
                <Space small>
                  <ToggleButton
                      v-model="conf.cellAlign"
                      name="セル内左揃え"
                      value="left">
                    {{ "左" }}
                  </ToggleButton>
                  <ToggleButton
                      v-model="conf.cellAlign"
                      name="セル内中央揃え"
                      value="center">
                    {{ "中央" }}
                  </ToggleButton>
                  <ToggleButton
                      v-model="conf.cellAlign"
                      name="セル内右揃え"
                      value="right">
                    {{ "右" }}
                  </ToggleButton>
                  <ToggleButton
                      v-model="conf.cellAlign"
                      name="セル内均等配置"
                      value="justify">
                    {{ "均等" }}
                  </ToggleButton>
                </Space>
              </Fieldset>
              <Fieldset v-if="conf.monospaceLayoutEnabled" label="セル幅基準">
                <Space small>
                  <ToggleButton
                      v-model="conf.cellWidthBasis"
                      name="行ごとの最大幅"
                      value="line">
                    {{ "行ごと" }}
                  </ToggleButton>
                  <ToggleButton
                      v-model="conf.cellWidthBasis"
                      name="全体の最大幅"
                      value="global">
                    {{ "全体共通" }}
                  </ToggleButton>
                </Space>
              </Fieldset>
            </Space>
          </Fieldset>
          <Fieldset
              v-if="showDetails || currentFilename"
              :label="`${!showDetails ? currentFilename : '出力ファイル名'}`">
            <Input
                v-if="showDetails"
                v-model="conf.filename"
                name="出力ファイル名"
                :placeholder="currentFilename"
                block />
          </Fieldset>
          <Button
              v-if="showDetails && !conf.filename && currentFilename"
              name="自動入力"
              @click="conf.filename = currentFilename2">
            {{ "自動入力" }}
          </Button>
          <Fieldset v-if="showDetails" label="字間 (文字分)">
            <Number
                v-model="conf.letterSpacing"
                block
                :min="-3"
                :max="3"
                :step="0.01" />
          </Fieldset>
          <Fieldset v-if="showDetails" label="行間 (文字分)">
            <Number
                v-model="conf.lineSpacing"
                block
                :min="-3"
                :max="3"
                :step="0.01" />
          </Fieldset>
          <Fieldset v-if="showDetails" label="全体余白 (文字分)">
            <Number
                v-model="conf.padding"
                block
                :min="-3"
                :max="3"
                :step="0.01" />
          </Fieldset>
          <Fieldset v-if="showDetails" label="行余白 (文字分)">
            <Number
                v-model="conf.margin"
                block
                :min="-3"
                :max="3"
                :step="0.005" />
          </Fieldset>
          <FontColorSelectBlock
              v-model="conf.color"
              v-model:gradient="conf.gradient"
              v-model:gradientSx="conf.gradientPos[0]"
              v-model:gradientSy="conf.gradientPos[1]"
              v-model:gradientEx="conf.gradientPos[2]"
              v-model:gradientEy="conf.gradientPos[3]"
              v-model:gradientMarker="conf.gradientMarker"
              :show-details="showDetails" />
          <OutlineBlock
              v-model="conf.outlines"
              :base-color="conf.color"
              :show-details="showDetails" />
        </Space>
      </GridItem>
    </Grid>
    <template #footer>
      <Checkbox v-model="showDetails" name="職人モード(テキスト)">
        {{ "詳細設定を表示" }}
      </Checkbox>
    </template>
  </Card>
</template>

<style scoped>
.font-preview {
  height: 1em;
  vertical-align: baseline;
}
</style>
