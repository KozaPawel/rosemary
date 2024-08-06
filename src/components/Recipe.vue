<script setup>
const props = defineProps({
  recipe: Object,
});

const formattedTime = (time) => {
  const formatted = time.replace('PT', '').replace('H', ':').replace('M', ':').replace('S', '');
  return formatted;
};
</script>

<template>
  <div>
    <text>{{ props.recipe }}</text>
    <!-- {{ formattedTime(props.recipe.prepTime) }} -->
  </div>
</template>
