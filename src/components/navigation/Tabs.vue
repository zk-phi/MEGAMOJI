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
  <div class="tabs is-toggle">
    <ul>
      <li v-for="t in tabs" :key="t.label" :class="modelValue === t.value ? 'is-active' : ''">
        <a @click="$emit('update:modelValue', t.value)">{{ t.label }}</a>
      </li>
    </ul>
  </div>
</template>
