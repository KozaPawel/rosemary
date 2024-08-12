<script setup>
import { onBeforeMount, ref } from 'vue';
import { supabase } from '@/supabase';
import { RouterLink } from 'vue-router';

import Navbar from '@/components/Navbar.vue';
import RecipeCard from '@/components/RecipeCard.vue';
import IconNoRecipes from '@/components/icons/IconNoRecipes.vue';

const fetchedRecipes = ref([]);

const fetchRecipes = async () => {
  let { data: recipes, error } = await supabase.from('recipes').select('*');
  fetchedRecipes.value = recipes;

  if (error) {
    alert(error.message);
  }
};

onBeforeMount(() => {
  fetchRecipes();
});
</script>

<template>
  <div class="overflow-auto">
    <Navbar class="sticky top-0 h-fit bg-light-background" />
    <div class="p-4 md:px-8">
      <h3 class="mb-2 text-2xl font-medium">Your recipes</h3>
      <RouterLink to="/new-recipe">
        <button
          class="mb-2 w-fit rounded-md bg-light-green-500 px-3 py-1 font-semibold text-light-background hover:bg-light-green-600"
        >
          Add new recipe
        </button>
      </RouterLink>
      <div class="grid h-full w-full grid-cols-4 gap-4" v-if="fetchedRecipes.length !== 0">
        <div
          v-for="recipe in fetchedRecipes"
          :key="recipe.id"
          class="col-span-4 md:col-span-2 lg:col-span-1"
        >
          <RecipeCard :recipe="recipe" />
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center">
        <IconNoRecipes class="max-h-96" />
        <p class="text-2xl">There's no recipes to show</p>
      </div>
    </div>
  </div>
</template>
