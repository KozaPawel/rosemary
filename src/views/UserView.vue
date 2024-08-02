<script setup>
import { onMounted, ref } from 'vue';
import { supabase } from '@/supabase';
import * as cheerio from 'cheerio';

import Navbar from '@/components/Navbar.vue';

const userInfo = ref(null);
const name = ref('');
const url = ref('');
const rec = ref(null);
const fetchedRecipe = ref('');
const cleanRecipe = ref([]);

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

const fetchRecipe = async () => {
  const { data, error } = await supabase.functions.invoke('scrap', {
    body: { url: url.value },
  });

  fetchedRecipe.value = data;

  getRecipeData();
};

const getRecipeData = async () => {
  const $ = cheerio.load(fetchedRecipe.value);

  let jsonld = JSON.parse($('script[type="application/ld+json"]').html());
  if (jsonld == null) {
    jsonld = '';
  }

  const ingredients = [];
  let instructions = [];

  const title =
    jsonld.name || $('meta[property="og:title"]').attr('content') || $('*[itemprop="name"]').text();
  const description =
    jsonld.description ||
    $('meta[property="og:description"]').attr('content') ||
    $('*[itemprop="description"]').text();
  const image = $('meta[property="og:image"]').attr('content');
  const servings =
    jsonld.recipeYield ||
    $('meta[itemprop="recipeYield"]').attr('content') ||
    $('*[itemprop="recipeYield"]').text();
  const prepTime = jsonld.prepTime || $('meta[itemprop="prepTime"]').attr('content');
  const cookTime = jsonld.cookTime || $('meta[itemprop="cookTime"]').attr('content');

  if (jsonld.recipeIngredient) {
    jsonld.recipeIngredient.forEach((ingredient) => {
      ingredients.push(ingredient);
    });
  } else {
    $('*[itemprop="recipeIngredient"]').each((index, element) => {
      ingredients.push($(element).text());
    });
  }

  if (jsonld.recipeInstructions) {
    instructions.push(jsonld.recipeInstructions);
  } else {
    $('*[itemprop="recipeInstructions"]').each((index, element) => {
      instructions.push($(element).text());
    });
  }

  cleanRecipe.value = {
    title,
    description,
    image,
    servings,
    prepTime,
    cookTime,
    ingredients,
    instructions,
  };
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
      <text>{{ cleanRecipe }}</text>
    </div>
    <form @submit.prevent="fetchRecipe()" class="flex w-fit flex-col gap-2">
      <div class="flex flex-col">
        <label for="url">Url</label>
        <input
          v-model="url"
          id="url"
          class="rounded-md border border-light-text bg-light-background px-2 py-1 placeholder:text-gray-500"
          type="url"
          required
        />
      </div>
      <button
        type="submit"
        class="mt-2 w-fit rounded-md bg-light-text px-3 py-1 text-light-background hover:bg-light-text/80"
      >
        Import
      </button>
    </form>
  </div>
</template>
