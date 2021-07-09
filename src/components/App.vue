<script>
import Nav from "./Nav.vue";
import TextBlock from "./formblocks/TextBlock.vue";
import ColorBlock from "./formblocks/ColorBlock.vue";
import TextSource from "./columns/TextSource.vue";
import FileSource from "./columns/FileSource.vue";
import FukumojiSource from "./columns/FukumojiSource.vue";
import controller from "./controller";

export default {
  ...controller,
  components: {
    Nav, TextBlock, ColorBlock, TextSource, FileSource, FukumojiSource,
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
      <a target="_blank" href="https://github.com/zk-phi/MEGAMOJI/blob/gh-pages/NEWS.markdown">
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

      <div v-if="ui.showTargetPanel" class="column">
        <div class="card">
          <div class="card-content">
            <div class="columns">
              <div class="column">
                <div class="field">
                  <label class="label">アニメーション</label>
                  <div class="control">
                    <div class="select">
                      <select v-model="target.animation">
                        <option value="">
                          なし
                        </option>
                        <option v-for="a in ANIMATIONS" :value="a.fn">
                          {{ a.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label class="label">WebGL 対応ブラウザのみ</label>
                  <div class="control">
                    <label v-for="effect in WEBGL_EFFECTS" class="checkbox">
                      <input v-model="target.webglEffects" type="checkbox" :value="effect.fn">
                      {{ effect.label }}
                    </label>
                  </div>
                </div>
                <div v-for="category in EFFECTS" class="field">
                  <label class="label">{{ category.label }}</label>
                  <div class="control">
                    <label v-for="effect in category.effects" class="checkbox">
                      <input v-model="target.effects" type="checkbox" :value="effect.fn">
                      {{ effect.label }}
                    </label>
                  </div>
                </div>
                <div v-for="category in POST_EFFECTS" class="field">
                  <label class="label">{{ category.label }}</label>
                  <div class="control">
                    <label v-for="effect in category.effects" class="checkbox">
                      <input v-model="target.postEffects" type="checkbox" :value="effect.fn">
                      {{ effect.label }}
                    </label>
                  </div>
                </div>
                <div v-if="ui.showTargetDetails">
                  <div v-for="category in PRO_EFFECTS" class="field">
                    <label class="label">{{ category.label }}</label>
                    <div class="control">
                      <label v-for="effect in category.effects" class="checkbox">
                        <input v-model="target.effects" type="checkbox" :value="effect.fn">
                        {{ effect.label }}
                      </label>
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">アニメ速度 (フレームレート): {{ target.framerate }}</label>
                    <div class="control">
                      <input v-model="target.framerate" type="range" min="1" max="60">
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">フレーム数: {{ target.framecount }}</label>
                    <div class="control">
                      <input v-model="target.framecount" type="range" min="1" max="12">
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">開発者用</label>
                    <div class="control">
                      <label class="checkbox">
                        <input v-model="target.noCrop" type="checkbox">
                        余白を切らない
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="field">
                  <label class="label">拡大縮小</label>
                  <div class="control">
                    <div class="select">
                      <select v-model="target.trimming" @change="refreshDefaultSettings">
                        <option value="">
                          ぴっちり
                        </option>
                        <option value="cover">
                          はみだす (アス比維持)
                        </option>
                        <option value="contain">
                          おさめる (アス比維持)
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="field">
                  <div class="control">
                    <label v-for="effect in STATIC_EFFECTS" class="checkbox">
                      <input v-model="target.staticEffects" type="checkbox" :value="effect.fn">
                      {{ effect.label }}
                    </label>
                  </div>
                </div>
                <div class="field">
                  <label class="label">スピード</label>
                  <div class="control">
                    <div class="select">
                      <select @change="onSelectSpeedPreset">
                        <option value="">
                          普通
                        </option>
                        <option value="turbo">
                          速い
                        </option>
                        <option value="super-turbo">
                          爆速
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="field">
                  <div class="control">
                    <label class="checkbox">
                      <input v-model="target.animationInvert" type="checkbox">
                      進行方向を反転
                    </label>
                  </div>
                </div>
                <ColorBlock
                    v-model="target.backgroundColor"
                    label="背景色"
                    :disabled="target.transparent" />
                <div class="field">
                  <div class="control">
                    <label class="checkbox">
                      <input v-model="target.transparent" type="checkbox">
                      背景を塗らない (アニメ gif は非推奨)
                    </label>
                  </div>
                </div>
                <div v-if="ui.showTargetDetails">
                  <div class="field">
                    <label class="label">分割 横</label>
                    <div class="control">
                      <input v-model="target.hCells" class="input" type="number" min="1" @change="refreshDefaultSettings">
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">分割 縦</label>
                    <div class="control">
                      <input v-model="target.vCells" class="input" type="number" min="1" @change="refreshDefaultSettings">
                    </div>
                  </div>
                  <TextBlock v-model="target.offsetLeft" label="オフセット左 (px)" />
                  <TextBlock v-model="target.offsetTop" label="オフセット上 (px)" />
                  <TextBlock v-model="target.hZoom" label="拡大率 (横)" />
                  <TextBlock v-model="target.vZoom" label="拡大率 (縦)" />
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <a class="card-footer-item" @click="onToggleTargetDetails">
              {{ ui.showTargetDetails ? '- 詳細を閉じる' : '+ 詳細オプション' }}
            </a>
          </div>
        </div>
      </div>

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
              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input v-model="previewMode" type="checkbox"> プレビュー
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="block">
          <div class="buttons">
            <button v-if="baseImage" class="button is-light is-link is-rounded"
                    @click="onSetShowTarget(!ui.showTargetPanel)">
              {{ ui.showTargetPanel ? 'もどる' : '効果をつける' }}
            </button>
            <button v-if="baseImage" class="button is-light is-danger is-rounded"
                    @click="reset">
              新規作成
            </button>
          </div>
        </div>
      </div>

    </div>

  </section>
</template>
