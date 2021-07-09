<script>
export default {
  props: ["value"],
};
</script>

<template>
  <div class="control">
    <input
        :value="value"
        class="input"
        type="text"
        @input="$emit('input', $event.target.value)" />
  </div>
</template>
