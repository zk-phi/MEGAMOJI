<script lang="ts">
import { defineComponent } from "vue";
import Decrement from "../icons/Decrement.vue";
import Increment from "../icons/Increment.vue";

export default defineComponent({
  components: {
    Decrement, Increment,
  },
  props: {
    modelValue: { type: Number, required: true },
    block: { type: Boolean, default: false },
    min: { type: Number, default: 0 },
    max: { type: Number, default: Infinity },
  },
  emits: [
    "update:modelValue",
  ],
  data: (props) => ({
    stringValue: String(props.modelValue),
    stringIsValid: true,
  }),
  watch: {
    modelValue: {
      handler() {
        this.stringValue = String(this.modelValue);
        this.stringIsValid = true;
      },
    },
  },
  methods: {
    onChange(value: string): void {
      const number = Number(value);
      this.stringValue = value;
      this.stringIsValid = value !== ""
                        && Number.isInteger(number)
                        && this.min <= number
                        && number <= this.max;
      if (this.stringIsValid) {
        this.$emit("update:modelValue", Math.min(this.max, Math.max(this.min, number)));
      }
    },
  },
});
</script>

<template>
  <div :class="['wrapper', { error: !stringIsValid }]">
    <input
        class="number"
        type="text"
        :value="stringValue"
        @input="onChange($event.target.value)">
    <div class="buttons">
      <button class="button" @click="onChange(modelValue - 1)">
        <Decrement />
      </button>
      <button class="button" @click="onChange(modelValue + 1)">
        <Increment />
      </button>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  --inputColorBase: var(--border);
  --inputColorHover: var(--primary);
  --inputColorActive: var(--primaryActive);
  --inputColorShadow: var(--primaryShadow);

  position: relative;
  display: inline-block;
}

.error {
  --inputColorBase: var(--danger);
  --inputColorHover: var(--dangerHover);
  --inputColorActive: var(--dangerActive);
  --inputColorShadow: var(--dangerShadow);
}

.block {
  display: block;
  width: 100%;
}

.number {
  width: 100%;
  box-sizing: border-box;
  padding: var(--numberPadding);
  font-size: var(--fontSizeMedium);
  line-height: 1;
  color: var(--fg);
  background-color: var(--bg);
  border: 1px solid var(--inputColorBase);
  border-radius: var(--borderRadius);
  outline: none;
}

.number:hover {
  border-color: var(--inputColorHover);
}

.number:focus {
  border-color: var(--inputColorHover);
  box-shadow: var(--inputColorShadow);
}

.number:active {
  border-color: var(--inputColorActive);
  box-shadow: var(--inputColorShadow);
}

.buttons {
  position: absolute;
  top: var(--paddingV);
  right: calc(var(--paddingH) - var(--spacingInlineSmall));
}

.button {
  padding: 0;
  font-size: var(--fontSizeXLarge);
  line-height: 1;
  color: var(--border);
  cursor: pointer;
  background-color: transparent;
  border: 0;
}
</style>
