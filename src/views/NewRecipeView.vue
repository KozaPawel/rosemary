<script setup>
import { ref } from 'vue';
import { supabase } from '@/supabase';
import * as cheerio from 'cheerio';

import Navbar from '@/components/Navbar.vue';
import Recipe from '@/components/Recipe.vue';
import LabeledInput from '@/components/LabeledInput.vue';

const url = ref('');
const fetchedRecipe = ref('');
const cleanRecipe = ref({});
const showPreview = ref(false);

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
    $('meta[property="og:title"]').attr('content') || $('*[itemprop="name"]').text() || jsonld.name;
  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('*[itemprop="description"]').text() ||
    jsonld.description;
  const image = $('meta[property="og:image"]').attr('content');
  const servings =
    jsonld.recipeYield ||
    $('meta[itemprop="recipeYield"]').attr('content') ||
    $('*[itemprop="recipeYield"]').text();
  let prepTime = jsonld.prepTime || $('meta[itemprop="prepTime"]').attr('content');
  let cookTime = jsonld.cookTime || $('meta[itemprop="cookTime"]').attr('content');

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

  if (!cookTime && prepTime.length > 0) {
    cookTime = prepTime;
    prepTime = '';
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
</script>

<template>
  <div class="h-screen w-screen overflow-auto">
    <Navbar class="sticky top-0 bg-light-background" />
    <div class="my-4 px-4 md:px-8">
      <div v-if="!showPreview" class="flex flex-col gap-4">
        <h3 class="text-2xl">Import recipe using it's url or create your own</h3>
        <form @submit.prevent="fetchRecipe()" class="flex flex-col gap-2">
          <LabeledInput
            v-model="url"
            :id="'url'"
            :label="'Recipe Url'"
            :type="'url'"
            :required="true"
            :placeholder="'Enter recipe url'"
          />
          <button
            type="submit"
            class="w-fit rounded-md bg-light-text px-3 py-1 font-semibold text-light-background hover:bg-light-text/80"
          >
            Import
          </button>
        </form>
        {{ cleanRecipe.title }}
        <div class="flex flex-col gap-2">
          <LabeledInput
            v-model="cleanRecipe.title"
            :id="'title'"
            :label="'Title'"
            :required="true"
          />
          <LabeledInput
            v-model="cleanRecipe.description"
            :id="'description'"
            :label="'Description'"
          />
          <LabeledInput v-model="cleanRecipe.servings" :id="'servings'" :label="'Servings'" />
          <div class="flex gap-2">
            <LabeledInput v-model="cleanRecipe.cookTime" :id="'ctime'" :label="'Cook time'" />
            <LabeledInput v-model="cleanRecipe.prepTime" :id="'ptime'" :label="'Prep time'" />
          </div>

          <label class="mt-2">Ingredients</label>
          <div class="flex flex-col gap-2">
            <input
              v-for="(ingredient, index) in cleanRecipe.ingredients"
              :key="index"
              v-model="cleanRecipe.ingredients[index]"
              class="w-full resize-y rounded-md border border-light-text bg-light-background px-2 py-1 placeholder:text-gray-500"
              type="text"
              :value="ingredient"
            />
          </div>
          <label class="mt-2">Instructions</label>
          <textarea
            v-for="(instuction, index) in cleanRecipe.instructions"
            :key="index"
            v-model="cleanRecipe.instructions[index]"
            class="h-32 resize-y rounded-md border border-light-text bg-light-background px-2 py-1 placeholder:text-gray-500"
          />
        </div>
      </div>
      <Recipe v-else :recipe="cleanRecipe" />
      <button @click="showPreview = !showPreview">Preview</button>
    </div>
  </div>
</template>
