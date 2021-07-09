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
      <li v-for="p in pages" :key="p.label" :class="modelValue === p.value ? 'is-active' : ''">
        <a @click="$emit('update:modelValue', p.value)">{{ p.label }}</a>
      </li>
    </ul>
  </div>
</template>
