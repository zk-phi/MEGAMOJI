<script>
export default {
  props: ['tabs', 'value'],
};
</script>

<template>
  <div class="block tabs is-toggle is-toggle-rounded">
    <ul>
      <li v-for="tab in tabs" :class="value === tab.value ? 'is-active' : ''">
        <a @click="$emit('input', tab.value)">{{ tab.label }}</a>
      </li>
    </ul>
  </div>
</template>
