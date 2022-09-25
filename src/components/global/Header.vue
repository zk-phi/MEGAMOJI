<template>
  <header class="header">
    <h1 class="title">
      MEGAMOJI
    </h1>
    <p class="description">
      カスタム絵文字をサクッと作れる
      <span class="nya" @mouseover="show" @mouseleave="hide">
        🐱
        <span class="message">{{ showMessage ? MESSAGES[messageIndex] : "" }}</span>
      </span>
    </p>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const MESSAGES = [
  "< Peace! ✌️",
  "< Love! 🫶",
  "< Unity! 🙏",
  "< Respect! 🤝",
  "< Nya! 💗",
];

export default defineComponent({
  data() {
    return {
      MESSAGES,
      showMessage: false,
      messageIndex: 0,
    };
  },
  methods: {
    show(): void {
      this.showMessage = true;
    },
    hide(): void {
      this.showMessage = false;
      this.messageIndex = (this.messageIndex + 1) % (MESSAGES.length);
    },
  },
});
</script>

<style scoped>
.header {
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
  cursor: pointer;
}

.nya:hover {
  display: inline-block;
  animation: nya 300ms ease-out;
}

.message {
  color: var(--border);
}

@keyframes nya {
  50% {
    transform: translateY(-2px);
  }
}
</style>
