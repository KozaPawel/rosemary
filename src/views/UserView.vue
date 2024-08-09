<script setup>
import { onMounted, ref } from 'vue';
import { supabase } from '@/supabase';
import { RouterLink } from 'vue-router';

import Navbar from '@/components/Navbar.vue';

const recipies = ref(null);

const fetchRecipes = async () => {
  let { data: recipes, error } = await supabase.from('recipes').select('*');
  recipies.value = recipes;

  if (error) {
    alert(error.message);
  }
};

onMounted(() => {
  fetchRecipes();
});
</script>

<template>
  <div class="h-screen w-screen">
    <Navbar class="sticky top-0 bg-light-background" />
    <div class="mt-4 px-4 md:px-8">
      <RouterLink to="/new-recipe">
        <button
          class="w-fit rounded-md bg-light-green-500 px-3 py-1 font-semibold text-light-background hover:bg-light-green-600"
        >
          Add new recipe
        </button>
      </RouterLink>
      <div class="whitespace-pre-line" v-for="recipe in recipies" :key="recipe">
        {{ recipe }}
      </div>
    </div>
  </div>
</template>
