<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@/supabase';

import Recipe from '@/components/Recipe.vue';
import IconSpinner from '@/components/icons/IconSpinner.vue';
import RecipeForm from '@/components/RecipeForm.vue';
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue';

const recipeId = useRoute().params.id;
const fetchedRecipe = ref({});
const showPreview = ref(false);
const showError = ref(false);
const isUpdating = ref(false);
const router = useRouter();
const isFetching = ref(false);

const updateRecipe = async () => {
  try {
    isUpdating.value = true;
    const { error } = await supabase
      .from('recipes')
      .update({
        title: fetchedRecipe.value.title,
        description: fetchedRecipe.value.description,
        image: fetchedRecipe.value.image,
        servings: fetchedRecipe.value.servings,
        prep_time: fetchedRecipe.value.prepTime,
        cook_time: fetchedRecipe.value.cookTime,
        ingredients: fetchedRecipe.value.ingredients,
        instructions: fetchedRecipe.value.instructions,
        recipe_url: fetchedRecipe.value.recipeUrl,
      })
      .eq('id', recipeId);

    if (error) {
      throw error;
    }

    router.push(`/recipe/${recipeId}`);
  } catch (error) {
    showError.value = true;
  } finally {
    isUpdating.value = false;
  }
};

const fetchRecipe = async () => {
  try {
    isFetching.value = true;

    let { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .select()
      .single();

    if (data.length === 0) {
      router.push('/user');
      return;
    }

    fetchedRecipe.value = {
      title: data.title,
      description: data.description,
      image: data.image,
      servings: data.servings,
      prepTime: data.prep_time,
      cookTime: data.cook_time,
      ingredients: data.ingredients,
      instructions: data.instructions,
      recipeUrl: data.recipe_url,
    };

    if (error) {
      throw error;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    isFetching.value = false;
  }
};

onBeforeMount(() => {
  fetchRecipe();
});
</script>

<template>
  <div>
    <div class="my-4 px-4 md:px-8" v-if="!isFetching">
      <button
        @click="router.push(`/recipe/${recipeId}`)"
        class="mb-2 flex items-center gap-1 p-2 hover:rounded-md hover:bg-light-text/10 md:mb-0"
      >
        <IconArrowLeft class="size-5" />
        <p class="font-normal">Back</p>
      </button>
      <h3 class="mb-4 text-2xl font-medium" v-if="!showPreview">Edit recipe</h3>
      <div v-if="!showPreview" class="flex flex-col gap-4">
        <RecipeForm :recipe="fetchedRecipe" :error="showError" />
      </div>
      <Recipe v-else :recipe="fetchedRecipe" />
      <div class="mt-4 flex w-full justify-end gap-4">
        <button
          @click="showPreview = !showPreview"
          class="w-fit rounded-md border border-light-green-500 px-3 py-1 font-semibold text-light-green-500 hover:bg-light-green-500 hover:text-light-background"
        >
          {{ showPreview ? 'Close preview' : 'Show preview' }}
        </button>
        <button
          @click="updateRecipe()"
          class="w-fit rounded-md bg-light-green-500 px-3 py-1 font-semibold text-light-background hover:bg-light-green-600"
          :disabled="isUpdating"
        >
          <text v-if="!isUpdating">Update recipe</text>
          <IconSpinner v-else />
        </button>
      </div>
    </div>
    <IconSpinner v-else class="m-auto mt-4 !h-12 !w-12 fill-light-text" />
  </div>
</template>
