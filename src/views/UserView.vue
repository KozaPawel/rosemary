<script setup>
import { onMounted, ref } from 'vue';
import { supabase } from '@/supabase';

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
    <div>
      <p>{{ rec }}</p>
    </div>
    <form
      @submit.prevent="addRecipe(userInfo.identities[0].user_id)"
      class="flex w-fit flex-col gap-2"
    >
      <div class="flex flex-col">
        <label for="email">name</label>
        <input
          v-model="name"
          id="email"
          class="rounded-md border border-light-text bg-light-background px-2 py-1 placeholder:text-gray-500"
          type="text"
          required
        />
      </div>
      <div class="flex flex-col">
        <label for="password">ulr</label>
        <input
          v-model="url"
          id="password"
          class="w-full rounded-md border border-light-text bg-light-background px-2 py-1 placeholder:text-gray-500"
          type="text"
          required
        />
      </div>
      <button
        type="submit"
        class="mt-2 w-fit rounded-md bg-light-text px-3 py-1 text-light-background hover:bg-light-text/80"
      >
        send
      </button>
    </form>
  </div>
</template>
