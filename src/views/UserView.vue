<script setup>
import { onMounted, ref } from 'vue';
import { supabase } from '@/supabase';
import { RouterLink } from 'vue-router';

import Navbar from '@/components/Navbar.vue';

const userInfo = ref(null);
const recipies = ref(null);

const getProfile = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  userInfo.value = session.user;
};

const fetchRecipes = async () => {
  let { data: recipes, error } = await supabase.from('recipes').select('*');
  recipies.value = recipes.map((recipe) => ({
    name: recipe.name,
    url: recipe.url,
  }));

  if (error) {
    alert(error.message);
  }
};

onMounted(() => {
  getProfile();
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
      <!-- <div class="overflow-scroll whitespace-pre-line" v-for="recipe in recipies" :key="recipe">
        {{ recipe.url }}
      </div> -->
    </div>
  </div>
</template>
