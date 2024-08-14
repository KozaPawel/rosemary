<script setup>
import { computed } from 'vue';

const props = defineProps({
  recipe: Object,
});

const cookTime = computed(() => {
  return props.recipe.cookTime || props.recipe.cook_time;
});

const prepTime = computed(() => {
  return props.recipe.prepTime || props.recipe.prep_time;
});

const recipeUrl = computed(() => {
  return props.recipe.recipeUrl || props.recipe.recipe_url;
});

const formattedTime = (time) => {
  let hours = Math.floor(time / 60);
  let minutes = time % 60;
  if (minutes === 0) {
    minutes = '00';
  } else if (minutes < 10) {
    minutes = '0' + minutes;
  }
  return hours + ':' + minutes + 'h';
};
</script>

<template>
  <div class="m-auto flex w-full flex-col gap-2 break-words md:w-1/2" v-if="props.recipe">
    <img :src="props.recipe.image" class="h-64 object-cover" v-if="props.recipe.image" />
    <h1 class="self-center text-3xl font-bold">{{ props.recipe.title }}</h1>
    <hr class="my-4 h-px border-0 bg-gray-300" v-if="props.recipe.title" />
    <h3 class="text-xl" v-if="props.recipe.description">{{ props.recipe.description }}</h3>
    <a
      :href="recipeUrl"
      target="_blank"
      class="w-fit break-all font-semibold text-light-green-500 hover:underline"
      v-if="recipeUrl"
    >
      {{ recipeUrl }}
    </a>
    <div
      class="flex flex-col gap-2 md:flex-row md:gap-12"
      v-if="props.recipe.servings || prepTime || cookTime"
    >
      <p v-if="props.recipe.servings">
        <text class="font-semibold">Servings:</text> {{ props.recipe.servings }}
      </p>
      <p v-if="prepTime">
        <text class="font-semibold">Prep time:</text> {{ formattedTime(prepTime) }}
      </p>
      <p v-if="cookTime">
        <text class="font-semibold">Cook time:</text>
        {{ formattedTime(cookTime) }}
      </p>
    </div>
    <div v-if="props.recipe.ingredients">
      <p class="text-lg font-semibold">Ingredients</p>
      <text class="whitespace-pre-line">
        {{ props.recipe.ingredients }}
      </text>
    </div>
    <div v-if="props.recipe.instructions">
      <p class="text-lg font-semibold">Instructions</p>
      <text class="whitespace-pre-line">
        {{ props.recipe.instructions }}
      </text>
    </div>
  </div>
</template>
