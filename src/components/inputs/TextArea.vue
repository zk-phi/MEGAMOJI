<script>
export default {
  props: ["value", "rows"],
};
</script>

<template>
  <div class="control">
    <textarea
        :value="value"
        class="textarea"
        :rows="rows"
        @input="$emit('input', $event.target.value)" />
  </div>
</template>
