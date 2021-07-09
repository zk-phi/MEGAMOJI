<script>
import Tabs from "./Tabs.vue";
import FontOption from "./inputs/FontOption.vue";
import FontColorOption from "./inputs/FontColorOption.vue";
import TextInput from "./inputs/TextInput.vue";
import TextArea from "./inputs/TextArea.vue";
import ButtonBlock from "./formblocks/ButtonBlock.vue";
import controller from "./controller";

export default {
  ...controller,
  components: {
    Tabs, FontOption, TextInput, TextArea, FontColorOption, ButtonBlock,
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
                <div class="field">
                  <label class="label">システムフォント</label>
                  <FontOption v-model="source.text.font" font="normal 1em sans-serif">
                    ゴシック
                  </FontOption>
                  <FontOption v-model="source.text.font" font="normal 1em serif">
                    明朝
                  </FontOption>
                </div>
                <div class="field">
                  <label class="label">スタンダード</label>
                  <FontOption v-model="source.text.font" font="bold 1em 'Noto Sans JP'">
                    ゴシック (太)
                  </FontOption>
                  <FontOption v-model="source.text.font" font="900 1em 'Noto Sans JP'">
                    ゴシック (極太)
                  </FontOption>
                  <FontOption v-model="source.text.font" font="bold 1em 'M PLUS Rounded 1c'">
                    丸ゴ (太)
                  </FontOption>
                  <FontOption v-model="source.text.font" font="900 1em 'M PLUS Rounded 1c'">
                    丸ゴ (極太)
                  </FontOption>
                  <FontOption v-model="source.text.font" font="900 1em 'Noto Serif JP'">
                    明朝 (太)
                  </FontOption>
                </div>
                <div class="field">
                  <label class="label">デザイン</label>
                  <FontOption v-model="source.text.font" font="normal 1em 'DelaGothicOne-Regular'">
                    Dela Gothic One
                  </FontOption>
                  <FontOption v-model="source.text.font" font="normal 1em 'AkazukiPOP'">
                    あかずきんポップ
                  </FontOption>
                  <FontOption v-model="source.text.font" font="normal 1em 'Potta'">
                    ポッタ
                  </FontOption>
                  <FontOption v-model="source.text.font" font="normal 1em 'ZeroGothic'">
                    零ゴシック
                  </FontOption>
                  <FontOption v-model="source.text.font" font="normal 1em 'PixelMplus'">
                    PixelMplus, bold
                  </FontOption>
                  <FontOption v-model="source.text.font" font="normal 1em 'Reggae'">
                    レゲエ
                  </FontOption>
                  <FontOption v-model="source.text.font" font="normal 1em 'Rampart'">
                    ランパート
                  </FontOption>
                </div>
                <div v-if="ui.showTextDetails">
                  <div class="field">
                    <label class="label">その他のフォント</label>
                    <TextInput v-model="source.text.font" />
                  </div>
                  <div class="field">
                    <label class="label">行間 (文字分)</label>
                    <TextInput v-model="source.text.lineSpacing" />
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="field">
                  <label class="label">テキスト (改行可)</label>
                  <TextArea v-model="source.text.content" rows="3" />
                </div>
                <div class="field">
                  <label class="label">揃え</label>
                  <div class="control">
                    <div class="select">
                      <select v-model="source.text.align">
                        <option value="stretch">
                          両端
                        </option>
                        <option value="left">
                          左
                        </option>
                        <option value="center">
                          中央
                        </option>
                        <option value="right">
                          右
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
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
                    <FontColorOption color="#7f0000" v-model="source.text.color" />
                    <FontColorOption color="#7f5f00" v-model="source.text.color" />
                    <FontColorOption color="#3f7f00" v-model="source.text.color" />
                    <FontColorOption color="#007f1f" v-model="source.text.color" />
                    <FontColorOption color="#007f7f" v-model="source.text.color" />
                    <FontColorOption color="#001f7f" v-model="source.text.color" />
                    <FontColorOption color="#3f007f" v-model="source.text.color" />
                    <FontColorOption color="#7f005f" v-model="source.text.color" />
                  </div>
                  <div class="control">
                    <FontColorOption color="#ff0000" v-model="source.text.color" />
                    <FontColorOption color="#ffbf00" v-model="source.text.color" />
                    <FontColorOption color="#7fff00" v-model="source.text.color" />
                    <FontColorOption color="#00ff3f" v-model="source.text.color" />
                    <FontColorOption color="#00ffff" v-model="source.text.color" />
                    <FontColorOption color="#003fff" v-model="source.text.color" />
                    <FontColorOption color="#7f00ff" v-model="source.text.color" />
                    <FontColorOption color="#ff00bf" v-model="source.text.color" />
                  </div>
                  <div class="control">
                    <FontColorOption color="#ff7f7f" v-model="source.text.color" />
                    <FontColorOption color="#ffdf7f" v-model="source.text.color" />
                    <FontColorOption color="#bfff7f" v-model="source.text.color" />
                    <FontColorOption color="#7fff9f" v-model="source.text.color" />
                    <FontColorOption color="#7fffff" v-model="source.text.color" />
                    <FontColorOption color="#7f9fff" v-model="source.text.color" />
                    <FontColorOption color="#bf7fff" v-model="source.text.color" />
                    <FontColorOption color="#ff7fdf" v-model="source.text.color" />
                  </div>
                </div>
                <ButtonBlock v-if="source.text.gradient.length == 0" :click="initializeGradient">
                  グラデーションを追加
                </ButtonBlock>
                <div v-for="(colorstop, ix) in source.text.gradient" class="field has-addons">
                  <div class="control">
                    <input v-model="source.text.gradient[ix].color" type="color" class="input">
                  </div>
                  <div class="control is-expanded">
                    <input v-model="source.text.gradient[ix].pos" class="input" type="range" min="1" max="100">
                  </div>
                  <div class="control">
                    <button class="button" @click="removeGradientColorStop(ix)">
                      x
                    </button>
                  </div>
                </div>
                <ButtonBlock v-if="source.text.gradient.length > 0" :click="addGradientColorStop">
                  + 色を追加
                </ButtonBlock>
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
                  <div class="field">
                    <label class="label">その他の色</label>
                    <div class="control">
                      <input v-model="source.text.color" class="input" type="color">
                    </div>
                  </div>
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
                   @click="onSelectFukumojiPart('base', e);" />
            </div>
            <div v-if="ui.fukumojiTab == 'eyes'" class="fukumoji">
              <img v-for="e in FUKUMOJI_EYES"
                   :class="'part' + (source.fukumoji.eyes == e ? ' selected' : '')"
                   :src="e"
                   @click="onSelectFukumojiPart('eyes', e);" />
            </div>
            <div v-if="ui.fukumojiTab == 'textures'" class="fukumoji">
              <img v-for="e in FUKUMOJI_TEXTURES"
                   :class="'part' + (source.fukumoji.textures == e ? ' selected' : '')"
                   :src="e"
                   @click="onSelectFukumojiPart('textures', e);" />
            </div>
            <div v-if="ui.fukumojiTab == 'mouths'" class="fukumoji">
              <img v-for="e in FUKUMOJI_MOUTHS"
                   :class="'part' + (source.fukumoji.mouths == e ? ' selected' : '')"
                   :src="e"
                   @click="onSelectFukumojiPart('mouths', e);" />
            </div>
            <div v-if="ui.fukumojiTab == 'others'" class="fukumoji">
              <img v-for="e in FUKUMOJI_OTHERS"
                   :class="'part' + (source.fukumoji.others == e ? ' selected' : '')"
                   :src="e"
                   @click="onSelectFukumojiPart('others', e);" />
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
                <div class="field">
                  <label class="label">背景色</label>
                  <div class="control">
                    <input v-model="target.backgroundColor" :disabled="target.transparent" class="input" type="color">
                  </div>
                </div>
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
                  <div class="field">
                    <label class="label">オフセット左 (px)</label>
                    <TextInput v-model="target.offsetLeft" />
                  </div>
                  <div class="field">
                    <label class="label">オフセット上 (px)</label>
                    <TextInput v-model="target.offsetTop" />
                  </div>
                  <div class="field">
                    <label class="label">拡大率 (横)</label>
                    <TextInput v-model="target.hZoom" />
                  </div>
                  <div class="field">
                    <label class="label">拡大率 (縦)</label>
                    <TextInput v-model="target.vZoom" />
                  </div>
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
