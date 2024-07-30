<script setup>
const props = defineProps({
  message: String,
});
</script>

<template>
  <text class="text-red-600">
    {{ props.message }}
  </text>
</template>
