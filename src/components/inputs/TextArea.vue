<script>
export default {
  props: ["modelValue", "rows"],
  emits: ["update:modelValue"],
};
</script>

<template>
  <div class="control">
    <textarea
        :value="modelValue"
        class="textarea"
        :rows="rows"
        @input="$emit('update:modelValue', $event.target.value)" />
  </div>
</template>
