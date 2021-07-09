<script>
export default {
  model: { prop: "checked", event: "change" },
  props: ["value", "label", "checked", "name"],
};
</script>

<template>
  <div class="control">
    <label class="radio" :style="{ font: value }">
      <input
        type="radio"
        :name="name"
        :checked="checked === value"
        :value="value"
        @change="$emit('change', value)">
      <slot />
    </label>
  </div>
</template>
