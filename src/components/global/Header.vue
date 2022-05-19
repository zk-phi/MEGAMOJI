<script lang="ts">
import { defineComponent } from "vue";
import Space from "./Space.vue";
import TabButton from "../inputs/TabButton.vue";
import Image from "../icons/Image.vue";
import Text from "../icons/Text.vue";
import Emoji from "../icons/Emoji.vue";

export default defineComponent({
  components: {
    Space,
    TabButton,
    Image,
    Text,
    Emoji,
  },
  props: {
    modelValue: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
  ],
});
</script>

<template>
  <header class="header">
    <Space vertical large full>
      <div class="brand">
        <h1 class="title">
          MEGAMOJI
        </h1>
        <p class="description">
          カスタム絵文字をサクッと作れる<span class="nya">🐱</span>
        </p>
      </div>
      <div>
        <TabButton
            :model-value="modelValue"
            value="text"
            @update:model-value="$emit('update:modelValue', $event)">
          <template #icon>
            <Text />
          </template>
          テキスト
        </TabButton>
        <TabButton
            :model-value="modelValue"
            value="file"
            @update:model-value="$emit('update:modelValue', $event)">
          <template #icon>
            <Image />
          </template>
          画像ファイル
        </TabButton>
        <TabButton
            :model-value="modelValue"
            value="parts"
            @update:model-value="$emit('update:modelValue', $event)">
          <template #icon>
            <Emoji />
          </template>
          パーツ
        </TabButton>
      </div>
    </Space>
  </header>
</template>

<style scoped>
.header {
  padding: var(--spacingLarge) var(--spacingLarge) 0;
  border-bottom: 1px solid var(--border);
}

.brand {
  display: flex;
  flex-wrap: wrap;
  color: var(--fg);
  align-items: flex-end;
  gap: var(--spacingMedium);
}

.title {
  margin: 0;
  font-size: var(--fontSizeTitle);
  font-weight: bold;
  line-height: 1;
}

.description {
  margin: 0;
  font-size: var(--fontSizeMedium);
  line-height: var(--multilineTextLineHeight);
  color: var(--fg);
}

.nya {
  cursor: grab;
}

.nya:hover::after {
  color: var(--border);
  content: " < nya!";
}
</style>
