<script>
import Tabs from "./Tabs.vue";
import FontSelectBlock from "./formblocks/FontSelectBlock.vue";
import FontColorOption from "./inputs/FontColorOption.vue";
import TextAreaBlock from "./formblocks/TextAreaBlock.vue";
import ButtonBlock from "./formblocks/ButtonBlock.vue";
import TextBlock from "./formblocks/TextBlock.vue";
import TextAlignSelectBlock from "./formblocks/TextAlignSelectBlock.vue";
import GradientBlock from "./formblocks/GradientBlock.vue";
import ColorBlock from "./formblocks/ColorBlock.vue";
import controller from "./controller";

export default {
  ...controller,
  components: {
    Tabs, FontSelectBlock, TextAlignSelectBlock, TextBlock,
    TextAreaBlock, FontColorOption, ButtonBlock, GradientBlock, ColorBlock,
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

    <Tabs
        :model-value="ui.showTargetPanel ? '' : ui.mode"
        :tabs="MODES"
        @update:modelValue="onSelectMode" />

    <div class="columns">

      <div v-if="ui.mode == 'text' && !ui.showTargetPanel" class="column">
        <div class="card">
          <div class="card-content">
            <div class="columns">
              <div class="column">
                <FontSelectBlock
                    v-model="source.text.font"
                    :show-details="ui.showTextDetails" />
                <TextBlock
                    v-if="ui.showTextDetails"
                    v-model="source.text.lineSpacing"
                    label="行間 (文字分)" />
              </div>
              <div class="column">
                <TextAreaBlock
                    v-model="source.text.content"
                    label="テキスト (改行可)"
                    :rows="3" />
                <TextAlignSelectBlock
                    v-model="source.text.align" />
                <div class="field">
                  <label class="label">色</label>
                  <div class="control">
                    <FontColorOption v-model="source.text.color" color="#000000" />
                    <FontColorOption v-model="source.text.color" color="#3f3f3f" />
                    <FontColorOption v-model="source.text.color" color="#7f7f7f" />
                    <FontColorOption v-model="source.text.color" color="#bfbfbf" />
                    <FontColorOption v-model="source.text.color" color="#ffffff" />
                  </div>
                  <div class="control">
                    <FontColorOption v-model="source.text.color" color="#7f0000" />
                    <FontColorOption v-model="source.text.color" color="#7f5f00" />
                    <FontColorOption v-model="source.text.color" color="#3f7f00" />
                    <FontColorOption v-model="source.text.color" color="#007f1f" />
                    <FontColorOption v-model="source.text.color" color="#007f7f" />
                    <FontColorOption v-model="source.text.color" color="#001f7f" />
                    <FontColorOption v-model="source.text.color" color="#3f007f" />
                    <FontColorOption v-model="source.text.color" color="#7f005f" />
                  </div>
                  <div class="control">
                    <FontColorOption v-model="source.text.color" color="#ff0000" />
                    <FontColorOption v-model="source.text.color" color="#ffbf00" />
                    <FontColorOption v-model="source.text.color" color="#7fff00" />
                    <FontColorOption v-model="source.text.color" color="#00ff3f" />
                    <FontColorOption v-model="source.text.color" color="#00ffff" />
                    <FontColorOption v-model="source.text.color" color="#003fff" />
                    <FontColorOption v-model="source.text.color" color="#7f00ff" />
                    <FontColorOption v-model="source.text.color" color="#ff00bf" />
                  </div>
                  <div class="control">
                    <FontColorOption v-model="source.text.color" color="#ff7f7f" />
                    <FontColorOption v-model="source.text.color" color="#ffdf7f" />
                    <FontColorOption v-model="source.text.color" color="#bfff7f" />
                    <FontColorOption v-model="source.text.color" color="#7fff9f" />
                    <FontColorOption v-model="source.text.color" color="#7fffff" />
                    <FontColorOption v-model="source.text.color" color="#7f9fff" />
                    <FontColorOption v-model="source.text.color" color="#bf7fff" />
                    <FontColorOption v-model="source.text.color" color="#ff7fdf" />
                  </div>
                </div>
                <GradientBlock
                    v-model="source.text.gradient"
                    :base-color="source.text.color" />
                <div class="field">
                  <label class="label">アウトライン</label>
                  <div class="control">
                    <label class="checkbox" style="color: #000000">
                      <input v-model="source.text.outlines" type="checkbox" name="outline" value="#000000">
                      ◆
                    </label>
                    <label class="checkbox" :style="{ color: darkerColor }">
                      <input v-model="source.text.outlines" type="checkbox" name="outline" value="darker">
                      ◆
                    </label>
                    <label class="checkbox" :style="{ color: source.text.color }">
                      <input v-model="source.text.outlines" type="checkbox" name="outline" value="identical">
                      ◆
                    </label>
                    <label class="checkbox" :style="{ color: lighterColor }">
                      <input v-model="source.text.outlines" type="checkbox" name="outline" value="lighter">
                      ◆
                    </label>
                    <label class="checkbox">
                      <input v-model="source.text.outlines" type="checkbox" name="outline" value="#ffffff">
                      ♢
                    </label>
                  </div>
                </div>
                <div v-if="ui.showTextDetails">
                  <ColorBlock
                      v-model="source.text.color"
                      label="その他の色" />
                  <div class="field">
                    <label class="label">その他のアウトライン</label>
                  </div>
                  <div v-for="(color, ix) in outlineColors" class="field has-addons">
                    <div class="control is-expanded">
                      <input class="input" type="color" :value="color"
                             @change="source.text.outlines[ix] = $event.target.value">
                    </div>
                    <div class="control">
                      <button class="button" @click="removeOutline(ix)">
                        x
                      </button>
                    </div>
                  </div>
                  <ButtonBlock :click="addOutline">
                    + アウトラインを追加
                  </ButtonBlock>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <a class="card-footer-item" @click="onToggleTextDetails">
              {{ ui.showTextDetails ? '- 詳細を閉じる' : '+ 詳細オプション' }}
            </a>
          </div>
        </div>
      </div>

      <div v-if="ui.mode == 'file' && !ui.showTargetPanel" class="column">
        <div class="card">
          <div class="card-content">
            <div class="field">
              <label class="label">ファイル</label>
              <div class="control">
                <input class="input" type="file" @change="onChangeFile">
              </div>
            </div>
            <div class="field">
              <label class="label">前処理</label>
              <div class="control">
                <div class="select">
                  <select v-model="source.file.filter">
                    <option value="">
                      なし
                    </option>
                    <option v-for="filter in FILTERS" :value="filter.fn">
                      {{ filter.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="ui.mode == 'fukumoji' && !ui.showTargetPanel" class="column">
        <div class="card">
          <div class="card-content">
            <div class="tabs is-toggle">
              <ul>
                <li :class="ui.fukumojiTab == 'base' ? 'is-active' : ''">
                  <a @click="onSelectFukumojiTab('base')">ベース</a>
                </li>
                <li :class="ui.fukumojiTab == 'eyes' ? 'is-active' : ''">
                  <a @click="onSelectFukumojiTab('eyes')">目</a>
                </li>
                <li :class="ui.fukumojiTab == 'mouths' ? 'is-active' : ''">
                  <a @click="onSelectFukumojiTab('mouths')">口</a>
                </li>
                <li :class="ui.fukumojiTab == 'others' ? 'is-active' : ''">
                  <a @click="onSelectFukumojiTab('others')">飾り</a>
                </li>
                <li :class="ui.fukumojiTab == 'textures' ? 'is-active' : ''">
                  <a @click="onSelectFukumojiTab('textures')">その他</a>
                </li>
              </ul>
            </div>
            <div v-if="ui.fukumojiTab == 'base'" class="fukumoji">
              <img v-for="e in FUKUMOJI_BASES"
                   :class="'part' + (source.fukumoji.base == e ? ' selected' : '')"
                   :src="e"
                   @click="onSelectFukumojiPart('base', e);">
            </div>
            <div v-if="ui.fukumojiTab == 'eyes'" class="fukumoji">
              <img v-for="e in FUKUMOJI_EYES"
                   :class="'part' + (source.fukumoji.eyes == e ? ' selected' : '')"
                   :src="e"
                   @click="onSelectFukumojiPart('eyes', e);">
            </div>
            <div v-if="ui.fukumojiTab == 'textures'" class="fukumoji">
              <img v-for="e in FUKUMOJI_TEXTURES"
                   :class="'part' + (source.fukumoji.textures == e ? ' selected' : '')"
                   :src="e"
                   @click="onSelectFukumojiPart('textures', e);">
            </div>
            <div v-if="ui.fukumojiTab == 'mouths'" class="fukumoji">
              <img v-for="e in FUKUMOJI_MOUTHS"
                   :class="'part' + (source.fukumoji.mouths == e ? ' selected' : '')"
                   :src="e"
                   @click="onSelectFukumojiPart('mouths', e);">
            </div>
            <div v-if="ui.fukumojiTab == 'others'" class="fukumoji">
              <img v-for="e in FUKUMOJI_OTHERS"
                   :class="'part' + (source.fukumoji.others == e ? ' selected' : '')"
                   :src="e"
                   @click="onSelectFukumojiPart('others', e);">
            </div>
          </div>
        </div>
      </div>

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
                    onClick="window.location.reload()">
              新規作成
            </button>
          </div>
        </div>
      </div>

    </div>

  </section>
</template>
