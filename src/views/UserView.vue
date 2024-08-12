<script setup>
import { onMounted, ref } from 'vue';
import { supabase } from '@/supabase';
import { RouterLink } from 'vue-router';

import Navbar from '@/components/Navbar.vue';
import RecipeCard from '@/components/RecipeCard.vue';

const fetchedRecipes = ref(null);

const fetchRecipes = async () => {
  let { data: recipes, error } = await supabase.from('recipes').select('*');
  fetchedRecipes.value = recipes;

  if (error) {
    alert(error.message);
  }
};

onMounted(() => {
  fetchRecipes();
});
</script>

<template>
  <div class="overflow-auto">
    <Navbar class="sticky top-0 h-fit bg-light-background" />
    <div class="p-4 md:px-8">
      <RouterLink to="/new-recipe">
        <button
          class="w-fit rounded-md bg-light-green-500 px-3 py-1 font-semibold text-light-background hover:bg-light-green-600"
        >
          Add new recipe
        </button>
      </RouterLink>
      <h3 class="mb-2 mt-4 text-2xl">Your recipes</h3>
      <div class="grid h-full w-full grid-cols-4 gap-4">
        <div v-for="recipe in fetchedRecipes" :key="recipe.id">
          <RecipeCard :recipe="recipe" />
        </div>
      </div>
    </div>
  </div>
</template>
