<script setup>
import IconImage from '@/components/icons/IconImage.vue';

const props = defineProps({
  recipe: Object,
});
</script>

<template>
  <div
    class="group col-span-4 h-full whitespace-pre-line rounded-md bg-light-green-100 shadow-md shadow-light-text/30 hover:cursor-pointer hover:bg-light-green-200 hover:shadow-light-text/50 md:col-span-2 lg:col-span-1"
  >
    <img
      v-if="props.recipe.image"
      :src="props.recipe.image"
      class="h-32 w-full rounded-t-md object-cover group-hover:brightness-90"
    />
    <div v-else class="flex flex-col items-center p-4">
      <IconImage />
      <text class="font-semibold">No image</text>
    </div>
    <p class="break-words px-2 py-1 text-lg font-medium">
      {{ props.recipe.title }}
    </p>
  </div>
</template>
