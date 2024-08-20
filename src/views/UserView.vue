<script setup>
import { onBeforeMount, ref } from 'vue';
import { supabase } from '@/supabase';
import { RouterLink } from 'vue-router';
import { useToast } from 'primevue/usetoast';

import RecipeCard from '@/components/RecipeCard.vue';
import IconNoRecipes from '@/components/icons/IconNoRecipes.vue';
import Pagination from '@/components/Pagination.vue';
import IconSpinner from '@/components/icons/IconSpinner.vue';
import LabeledInput from '@/components/LabeledInput.vue';
import IconX from '@/components/icons/IconX.vue';

const toast = useToast();
const recipes = ref([]);
const currentPage = ref(0);
const isFetching = ref(false);
const searchQuery = ref('');

const fetchRecipes = async (page) => {
  let fetchedRecipes;
  try {
    isFetching.value = true;
    const { from, to } = getPagination(page, 20);
    let { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .ilike('title', `%${searchQuery.value}%`)
      .range(from, to);

    if (error) {
      throw error;
    }

    fetchedRecipes = recipes;
  } catch (error) {
    alert(error.message);
  } finally {
    isFetching.value = false;
  }

  return fetchedRecipes;
};

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const from = page ? page * limit : 0;
  const to = page ? from + size - 1 : size - 1;

  return { from, to };
};

const getNextPage = async () => {
  currentPage.value += 1;
  let fetchedRecipes = await fetchRecipes(currentPage.value);
  if (fetchedRecipes.length > 0) {
    recipes.value = fetchedRecipes;
  } else {
    toast.add({
      severity: 'info',
      summary: 'Oops',
      detail: 'There are no more recipes',
      life: 3000,
    });

    currentPage.value -= 1;
  }
};

const getPreviousPage = async () => {
  if (currentPage.value > 0) {
    currentPage.value -= 1;
    let fetchedRecipes = await fetchRecipes(currentPage.value);

    if (fetchedRecipes.length > 0) {
      recipes.value = fetchedRecipes;
    }
  }
};

const filterRecipes = async () => {
  let fetchedRecipes;
  if (searchQuery.value.length > 0) {
    currentPage.value = 0;
    fetchedRecipes = await fetchRecipes(0);

    recipes.value = fetchedRecipes;
  }
};

const clearFilters = async () => {
  searchQuery.value = '';
  currentPage.value = 0;
  recipes.value = await fetchRecipes(currentPage.value);
};

onBeforeMount(async () => {
  recipes.value = await fetchRecipes(currentPage.value);
});
</script>

<template>
  <div>
    <div class="p-4 md:px-8">
      <h3 class="mb-2 text-2xl font-medium">Your recipes</h3>
      <RouterLink to="/new-recipe">
        <button
          class="mb-3 w-fit rounded-md bg-light-green-500 px-3 py-1 font-semibold text-light-background hover:bg-light-green-600"
        >
          Add new recipe
        </button>
      </RouterLink>
      <form @submit.prevent="filterRecipes()" class="mb-2 flex flex-wrap items-end gap-2">
        <LabeledInput
          v-model="searchQuery"
          :id="'search'"
          :label="'Search'"
          :placeholder="'Recipe title..'"
          class="w-full md:w-1/3 lg:w-1/4"
        />
        <button
          type="submit"
          class="w-fit rounded-md bg-light-text px-3 py-1 font-semibold text-light-background hover:bg-light-text/80"
        >
          Search
        </button>
        <button
          @click.prevent="clearFilters()"
          v-if="searchQuery.length > 0"
          class="rounded-md bg-light-text px-1 py-1 font-semibold text-light-background hover:bg-light-text/80"
        >
          <IconX class="size-6 fill-light-background" />
        </button>
      </form>
      <div v-if="!isFetching">
        <div class="grid h-full w-full grid-cols-4 gap-4" v-if="recipes.length !== 0">
          <div
            v-for="recipe in recipes"
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
        <Pagination
          v-if="recipes.length !== 0"
          @next-page="getNextPage()"
          @previous-page="getPreviousPage()"
          class="mt-4"
        />
      </div>
      <IconSpinner v-else class="m-auto mt-4 !h-12 !w-12 fill-light-text" />
    </div>
  </div>
</template>
