<script setup>
import { onMounted, ref } from 'vue';
import { supabase } from '@/supabase';
import { RouterLink } from 'vue-router';

import Navbar from '@/components/Navbar.vue';

const userInfo = ref(null);
const name = ref('');
const url = ref('');
const rec = ref(null);

const getProfile = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  userInfo.value = session.user;
};

const fetchRecipes = async () => {
  let { data: recipes, error } = await supabase.from('recipes').select('*');
  rec.value = recipes.map((recipe) => ({
    name: recipe.name,
    url: recipe.url,
  }));

  if (error) {
    alert(error.message);
  }
};

const addRecipe = async (user_id) => {
  const { data, error } = await supabase
    .from('recipes')
    .insert([
      {
        user_id: user_id,
        name: name.value,
        url: url.value,
      },
    ])
    .select();

  if (error) {
    alert(error.message);
    return;
  }

  rec.value.push(
    data.map((item) => ({
      name: item.name,
      url: item.url,
    })),
  );
  name.value = '';
  url.value = '';
};

onMounted(() => {
  getProfile();
  fetchRecipes();
});
</script>

<template>
  <div class="h-screen w-screen">
    <Navbar />
    <div class="mt-4 px-4 md:px-8">
      <RouterLink to="/new-recipe">
        <button
          class="w-fit rounded-md bg-light-green-500 px-3 py-1 font-semibold text-light-background hover:bg-light-green-600"
        >
          Add new recipe
        </button>
      </RouterLink>
    </div>
  </div>
</template>
