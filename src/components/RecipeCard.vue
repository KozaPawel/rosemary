<script setup>
import { RouterLink } from 'vue-router';

import IconImage from '@/components/icons/IconImage.vue';

const props = defineProps({
  recipe: Object,
});
</script>

<template>
  <RouterLink :to="`/recipe/${props.recipe.id}`">
    <div
      class="group h-full whitespace-pre-line rounded-md bg-light-green-100 shadow-md shadow-light-text/30 hover:cursor-pointer hover:bg-light-green-200 hover:shadow-light-text/50"
    >
      <img
        v-if="props.recipe.image"
        :src="props.recipe.image"
        class="h-32 w-full rounded-t-md object-cover group-hover:brightness-90"
      />
      <div v-else class="flex h-32 flex-col items-center justify-center p-4">
        <IconImage class="" />
        <text class="font-semibold">No image</text>
      </div>
      <p class="break-words px-2 py-1 text-lg font-medium">
        {{ props.recipe.title }}
      </p>
    </div>
  </RouterLink>
</template>
