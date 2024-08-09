<script setup>
import { ref } from 'vue';
import { supabase } from '@/supabase';
import * as cheerio from 'cheerio';

import Navbar from '@/components/Navbar.vue';
import Recipe from '@/components/Recipe.vue';
import LabeledInput from '@/components/LabeledInput.vue';
import IconSpinner from '@/components/icons/IconSpinner.vue';

const url = ref('');
const fetchedRecipe = ref('');
const cleanRecipe = ref({});
const showPreview = ref(false);
const isImporting = ref(false);

const fetchRecipe = async () => {
  isImporting.value = true;
  const { data, error } = await supabase.functions.invoke('scrap', {
    body: { url: url.value },
  });

  fetchedRecipe.value = data;

  getRecipeData();
  isImporting.value = false;
};

const getRecipeData = async () => {
  const $ = cheerio.load(fetchedRecipe.value);

  let jsonld = JSON.parse($('script[type="application/ld+json"]').html());
  if (jsonld == null) {
    jsonld = '';
  }

  let ingredients = '';
  let instructions = '';

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
  let prepTime = jsonld.prepTime || $('meta[itemprop="prepTime"]').attr('content') || '';
  let cookTime = jsonld.cookTime || $('meta[itemprop="cookTime"]').attr('content') || '';
  const recipeUrl = url.value;

  if (jsonld.recipeIngredient) {
    jsonld.recipeIngredient.forEach((ingredient, index) => {
      if (index !== 0) ingredients += '\n';
      ingredients += ingredient;
    });
  } else {
    $('*[itemprop="recipeIngredient"]').each((index, element) => {
      if (index !== 0) ingredients += '\n';
      ingredients += $(element).html();
    });
  }

  if (jsonld.recipeInstructions) {
    instructions = JSON.stringify(jsonld.recipeInstructions);
  } else {
    $('*[itemprop="recipeInstructions"]').each((index, element) => {
      if (index !== 0) instructions += '\n\n';
      instructions += $(element)
        .text()
        .replace(/(\r\n|\n|\r|\t)/gm, '');
    });
  }

  if (!cookTime && prepTime.length > 0) {
    cookTime = prepTime;
    prepTime = '';
  }

  if (ingredients.length === 0 || instructions.length === 0) {
    $('div')
      .find('ul, ol')
      .each((index, element) => {
        const hasLink = $(element).find('a').length > 0;
        if (!hasLink) {
          $(element)
            .find('li')
            .each((index, li) => {
              const text = $(li)
                .text()
                .replace(/(\r\n|\n|\r|\t)/gm, '');

              const ingredientPoints = checkIfIngredient(text);
              const instructionPoints = checkIfInstruction(text);

              if (ingredientPoints > instructionPoints) {
                if (index !== 0 || ingredients.length > 0) ingredients += '\n';
                ingredients += text;
              } else {
                if (index !== 0 || instructions.length > 0) instructions += '\n\n';
                instructions += text;
              }
            });
        }
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
    recipeUrl,
  };
};

const checkIfIngredient = (item) => {
  let points = 0;

  if (
    item.charAt(0) === item.charAt(0).toLowerCase() &&
    item.charAt(0) !== item.charAt(0).toUpperCase()
  )
    points += 1;
  if (item === item.toLowerCase() && item !== item.toUpperCase()) points += 1;
  if (item.charAt(0) >= '0' && item.charAt(0) <= '9') points += 1;
  if (item.length < 60) points += 1;

  return points;
};

const checkIfInstruction = (item) => {
  let points = 0;
  const endsWithPunctuation = !!item.match(/[,.:!?]$/);
  const hasOtherUpperCases = !!item.slice(1).match(/[A-Z]/);

  if (
    item.charAt(0) !== item.charAt(0).toLowerCase() &&
    item.charAt(0) === item.charAt(0).toUpperCase()
  )
    points += 1;
  if (item.length > 60) points += 1;
  if (endsWithPunctuation) points += 1;
  if (hasOtherUpperCases) points += 1;

  return points;
};

const addRecipe = async () => {
  const { data, error } = await supabase
    .from('recipes')
    .insert([
      {
        title: cleanRecipe.value.title,
      },
    ])
    .select();

  if (error) {
    alert(error.message);
    return;
  }
};
</script>

<template>
  <div class="h-screen w-screen overflow-auto">
    <Navbar class="sticky top-0 bg-light-background" />
    <div class="my-4 px-4 md:px-8">
      <h3 class="mb-4 text-2xl" v-if="!showPreview">
        Import recipe using it's url or create your own
      </h3>
      <div v-if="!showPreview" class="flex flex-col gap-4">
        <form @submit.prevent="fetchRecipe()" class="flex w-full flex-col gap-2 md:w-1/2">
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
            :disabled="isImporting"
          >
            <text v-if="!isImporting">Import</text>
            <IconSpinner v-else class="!fill-light-background text-light-text" />
          </button>
        </form>
        <div class="mt-2 flex w-full flex-col justify-between gap-2 md:flex-row">
          <div class="flex w-full flex-col gap-2">
            <LabeledInput
              v-model="cleanRecipe.title"
              :id="'title'"
              :label="'Title'"
              :required="true"
              :placeholder="'Enter recipe name'"
            />
            <LabeledInput
              v-model="cleanRecipe.description"
              :id="'description'"
              :label="'Description'"
              :placeholder="'Describe your recipe'"
            />
            <LabeledInput
              v-model="cleanRecipe.servings"
              :id="'servings'"
              :label="'Servings'"
              :placeholder="'Number of servings'"
            />
            <div class="flex w-full flex-col gap-2 md:flex-row">
              <LabeledInput
                v-model="cleanRecipe.cookTime"
                :id="'ctime'"
                :label="'Cook time'"
                :placeholder="'eg. 01:30'"
                class="w-full"
              />
              <LabeledInput
                v-model="cleanRecipe.prepTime"
                :id="'ptime'"
                :label="'Prep time'"
                :placeholder="'eg. 00:30'"
                class="w-full"
              />
            </div>
            <LabeledInput
              v-model="cleanRecipe.recipeUrl"
              :id="'url2'"
              :label="'Url'"
              :placeholder="'https://'"
              class="w-full"
            />
          </div>

          <div class="flex h-full w-full flex-col gap-2">
            <div class="flex flex-col">
              <label for="ingredients">Ingredients</label>
              <textarea
                id="ingredients"
                v-model="cleanRecipe.ingredients"
                class="min-h-32 resize-y rounded-md border border-light-text bg-light-background px-2 py-1 placeholder:text-gray-500"
                :placeholder="'ingredient1\ningredient2'"
              ></textarea>
            </div>
            <div class="flex flex-col">
              <label for="instructions">Instructions</label>
              <textarea
                id="instructions"
                v-model="cleanRecipe.instructions"
                class="min-h-32 resize-y rounded-md border border-light-text bg-light-background px-2 py-1 placeholder:text-gray-500"
                :placeholder="'Do this...\nDo that...'"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <Recipe v-else :recipe="cleanRecipe" />
      <div class="mt-4 flex w-full justify-end gap-4">
        <button
          @click="showPreview = !showPreview"
          class="w-fit rounded-md border border-light-green-500 px-3 py-1 font-semibold text-light-green-500 hover:bg-light-green-500 hover:text-light-background"
        >
          {{ showPreview ? 'Close preview' : 'Show preview' }}
        </button>
        <button
          @click="addRecipe()"
          class="w-fit rounded-md bg-light-green-500 px-3 py-1 font-semibold text-light-background hover:bg-light-green-600"
        >
          Save recipe
        </button>
      </div>
    </div>
  </div>
</template>
