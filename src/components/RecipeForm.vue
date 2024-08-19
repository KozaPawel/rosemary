<script setup>
import { computed } from 'vue';

import LabeledInput from '@/components/LabeledInput.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

const props = defineProps({
  recipe: Object,
  error: Boolean,
});

const recipe = computed(() => {
  return props.recipe;
});
</script>

<template>
  <div class="mt-2 flex w-full flex-col justify-between gap-2 md:flex-row">
    <div class="flex w-full flex-col gap-2">
      <LabeledInput
        v-model="recipe.title"
        :id="'title'"
        :label="'Title'"
        :required="true"
        :error="error"
      />
      <ErrorMessage v-if="error" :message="'Title field is required'" />
      <LabeledInput v-model="recipe.description" :id="'description'" :label="'Description'" />
      <LabeledInput v-model="recipe.servings" :id="'servings'" :label="'Servings'" />
      <div class="flex w-full flex-col gap-2 md:flex-row">
        <LabeledInput
          v-model="recipe.prepTime"
          :id="'ptime'"
          :label="'Prep time (minutes)'"
          :type="'number'"
          class="w-full"
        />
        <LabeledInput
          v-model="recipe.cookTime"
          :id="'ctime'"
          :label="'Cook time (minutes)'"
          :type="'number'"
          class="w-full"
        />
      </div>
      <LabeledInput v-model="recipe.recipeUrl" :id="'url2'" :label="'Url'" class="w-full" />
    </div>

    <div class="flex h-full w-full flex-col gap-2">
      <div class="flex flex-col">
        <label for="ingredients">Ingredients (one per line)</label>
        <textarea
          id="ingredients"
          v-model="recipe.ingredients"
          class="min-h-32 resize-y rounded-md border border-light-text bg-light-background px-2 py-1 placeholder:text-gray-500"
        ></textarea>
      </div>
      <div class="flex flex-col">
        <label for="instructions">Instructions (one per line)</label>
        <textarea
          id="instructions"
          v-model="recipe.instructions"
          class="min-h-32 resize-y rounded-md border border-light-text bg-light-background px-2 py-1 placeholder:text-gray-500"
        ></textarea>
      </div>
    </div>
  </div>
</template>
