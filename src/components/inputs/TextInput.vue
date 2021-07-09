<script>
export default {
  props: ["modelValue"],
  emits: ["update:modelValue"],
};
</script>

<template>
  <div class="control">
    <input
        :value="modelValue"
        class="input"
        type="text"
        @input="$emit('update:modelValue', $event.target.value)" />
  </div>
</template>
