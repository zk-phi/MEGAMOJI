<script lang="ts">
import Nav from "./Nav.vue";
import TextSource from "./columns/TextSource.vue";
import FileSource from "./columns/FileSource.vue";
import FukumojiSource from "./columns/FukumojiSource.vue";
import CheckboxBlock from "./formblocks/CheckboxBlock.vue";
import Target from "./columns/Target.vue";

export default {
  components: {
    Nav, TextSource, FileSource, FukumojiSource, CheckboxBlock, Target,
  },
  data: (): Record<string, unknown> => ({
    MODES: [
      { value: "text", label: "テキストから作る" },
      { value: "file", label: "画像から作る" },
      { value: "fukumoji", label: "パーツを選んで作る" },
    ],
    baseImage: null,
    resultImages: [[]],
    previewMode: false,
    /* ui */
    ui: {
      mode: "text",
      showTargetPanel: false,
      fukumojiTab: "base",
      showTargetDetails: false,
    },
  }),
  methods: {
    onSetShowTarget(value: boolean): void {
      this.ui.showTargetPanel = value;
      ga("send", "pageview", value ? "/target" : (`/${this.ui.mode}`));
    },
    onSelectMode(value: string): void {
      this.ui.mode = value;
      this.ui.showTargetPanel = false;
      ga("send", "pageview", `/${value}`);
    },
    onRenderTarget(imgs): void {
      this.resultImages = imgs;
      ga("send", "event", this.ui.mode, "render");
    },
    onRender(img): void {
      this.baseImage = img;
    },
  },
};
</script>

<template>
  <section class="section">

    <h1 class="title">
      MEGAMOJI - 簡単アニメ絵文字メーカー
    </h1>
    <h2 class="subtitle">
      Slack (など) の絵文字をサクッと作成できるジェネレータです
      <a target="_blank" href="https://github.com/zk-phi/MEGAMOJI/blob/master/NEWS.markdown">
        更新履歴
      </a>
    </h2>

    <Nav
        :model-value="ui.showTargetPanel ? '' : ui.mode"
        :pages="MODES"
        @update:modelValue="onSelectMode" />

    <div class="columns">

      <TextSource :show="ui.mode == 'text' && !ui.showTargetPanel" @render="onRender" />
      <FileSource :show="ui.mode == 'file' && !ui.showTargetPanel" @render="onRender" />
      <FukumojiSource :show="ui.mode == 'fukumoji' && !ui.showTargetPanel" @render="onRender" />
      <Target :show="ui.showTargetPanel" :base-image="baseImage" @render="onRenderTarget" />

      <div class="column is-one-third">
        <div class="block">
          <div class="card mb">
            <div class="card-content result_area">
              <div class="field">
                <label class="label">絵文字 (右クリックで保存)</label>
                <div v-for="row in resultImages" v-if="!previewMode" class="row">
                  <img v-for="col in row" class="cell default" :src="col">
                </div>
                <div v-for="mode in ['light', 'dark']" v-else :class="'preview ' + mode">
                  <div>
                    <b>zk-phi</b> <small>1:23 AM</small>
                  </div>
                  <div v-for="row in resultImages" class="row">
                    <img v-for="col in row" class="cell large" :src="col">
                  </div>
                  <div>
                    ほげほげほげほげほげほげほげほげ。
                  </div>
                  <div>
                    文章中で使うとこんな
                    <span v-for="row in resultImages">
                      <img v-for="col in row" class="cell small" :src="col">
                    </span>
                    感じ。
                  </div>
                  <div>
                    <span v-for="row in resultImages">
                      <div v-for="col in row" class="reaction">
                        <img class="cell smallest" :src="col"> 5
                      </div>
                    </span>
                  </div>
                </div>
              </div>
              <CheckboxBlock v-model="previewMode">
                プレビュー
              </CheckboxBlock>
            </div>
          </div>
        </div>
        <div class="block">
          <div class="buttons">
            <button v-if="baseImage" class="button is-light is-link is-rounded is-fullwidth"
                    @click="onSetShowTarget(!ui.showTargetPanel)">
              {{ ui.showTargetPanel ? 'もどる' : '効果をつける' }}
            </button>
          </div>
        </div>
      </div>

    </div>

  </section>
</template>
