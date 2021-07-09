<script>
export default {
  props: {
    modelValue: { type: String, required: true },
    pages: { type: Array, required: true },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <div class="block tabs is-toggle is-toggle-rounded">
    <ul>
      <li v-for="page in pages" :class="modelValue === page.value ? 'is-active' : ''">
        <a @click="$emit('update:modelValue', page.value)">{{ page.label }}</a>
      </li>
    </ul>
  </div>
</template>
