<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase';
import * as cheerio from 'cheerio';

import Recipe from '@/components/Recipe.vue';
import LabeledInput from '@/components/LabeledInput.vue';
import IconSpinner from '@/components/icons/IconSpinner.vue';
import RecipeForm from '@/components/RecipeForm.vue';

const url = ref('');
const fetchedRecipe = ref('');
const cleanRecipe = ref({});
const showPreview = ref(false);
const showError = ref(false);
const isImporting = ref(false);
const isSaving = ref(false);
const router = useRouter();

const fetchRecipe = async () => {
  try {
    isImporting.value = true;
    const { data, error } = await supabase.functions.invoke('scrap', {
      body: { url: url.value },
    });

    if (error) {
      throw error;
    }

    fetchedRecipe.value = data;

    getRecipeData();
  } catch (error) {
    alert(error.message);
  } finally {
    isImporting.value = false;
  }
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

  if (prepTime) {
    prepTime = timeToMinutes(prepTime);
  }
  if (cookTime) {
    cookTime = timeToMinutes(cookTime);
  }

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

const timeToMinutes = (time) => {
  let timeInMinutes = time.toLowerCase().replace('pt', '');
  let hours = timeInMinutes.match(/(\d+)h/) || 0;
  let minutes = timeInMinutes.match(/(\d+)m/) || 0;

  if (hours) {
    hours = hours[1];
  }
  if (minutes) {
    minutes = minutes[1];
  }

  return hours * 60 + minutes * 1;
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
  try {
    isSaving.value = true;
    showError.value = false;
    const { data, error } = await supabase
      .from('recipes')
      .insert([
        {
          title: cleanRecipe.value.title,
          description: cleanRecipe.value.description,
          servings: cleanRecipe.value.servings,
          cook_time: cleanRecipe.value.cookTime,
          prep_time: cleanRecipe.value.prepTime,
          ingredients: cleanRecipe.value.ingredients,
          instructions: cleanRecipe.value.instructions,
          recipe_url: cleanRecipe.value.recipeUrl,
          image: cleanRecipe.value.image,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    router.push(`/recipe/${data[0].id}`);
  } catch (error) {
    showError.value = true;
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div>
    <div class="my-4 px-4 md:px-8">
      <h3 class="mb-4 text-2xl font-medium" v-if="!showPreview">
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
        <RecipeForm :recipe="cleanRecipe" :error="showError" />
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
          :disabled="isSaving"
        >
          <text v-if="!isSaving">Save recipe</text>
          <IconSpinner v-else />
        </button>
      </div>
    </div>
  </div>
</template>
