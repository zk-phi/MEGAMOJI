<script>
export default {
  props: {
    modelValue: { type: String, required: true },
    tabs: { type: Array, required: true },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <div class="block tabs is-toggle is-toggle-rounded">
    <ul>
      <li v-for="tab in tabs" :class="modelValue === tab.value ? 'is-active' : ''">
        <a @click="$emit('update:modelValue', tab.value)">{{ tab.label }}</a>
      </li>
    </ul>
  </div>
</template>
