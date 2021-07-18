<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    src: { type: String, required: true },
  },
  data() {
    return {
      hasReacted: false,
    };
  },
  methods: {
    toggleReacted() {
      this.hasReacted = !this.hasReacted;
    },
  },
});
</script>

<template>
  <div
    :class="'reaction' + (hasReacted ? ' reacted' : '')"
    @click="toggleReacted"
  >
    <img class="reaction_icon" :src="src" /> 5
  </div>
</template>

<style scoped>
.reaction {
  display: inline-block;
  padding: 3px 6px;
  margin: 2px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  background-color: rgba(128, 128, 128, 0.3);
  border: 1px solid transparent;
  border-radius: 12px;
}

.reaction.reacted,
.reaction.reacted:hover {
  box-shadow: inset 0 0 0 1.5px rgb(29, 155, 209);
  background-color: rgba(29, 155, 209, 0.1);
  color: rgb(18, 100, 163);
  border-color: transparent;
}

.reaction:hover {
  background-color: rgba(128, 128, 128, 0.2);
  border-color: currentColor;
}

.reaction_icon {
  width: 19px;
  vertical-align: -5px;
}
</style>
