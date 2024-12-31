<template>
  <header class="header">
    <h1 class="title">
      MEGAMOJI
    </h1>
    <p class="description">
      カスタム絵文字をサクッと作れる<span class="nya">🎍</span>
    </p>
  </header>
</template>

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

.nya:hover::after {
  color: var(--border);
  content: " < Happy New Nyaa!";
}

@keyframes nya {
  50% {
    transform: translateY(-2px);
  }
}
</style>
