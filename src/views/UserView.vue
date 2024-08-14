<script setup>
import { onBeforeMount, ref } from 'vue';
import { supabase } from '@/supabase';
import { RouterLink } from 'vue-router';

import Navbar from '@/components/Navbar.vue';
import RecipeCard from '@/components/RecipeCard.vue';
import IconNoRecipes from '@/components/icons/IconNoRecipes.vue';
import Pagination from '@/components/Pagination.vue';
import IconSpinner from '@/components/icons/IconSpinner.vue';

const fetchedRecipes = ref([]);
const currentPage = ref(0);
const isFetching = ref(false);

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const from = page ? page * limit : 0;
  const to = page ? from + size - 1 : size - 1;

  return { from, to };
};

const getNextPage = () => {
  currentPage.value += 1;
  fetchRecipes(currentPage.value);
};

const getPreviousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value -= 1;
    fetchRecipes(currentPage.value);
  }
};

const fetchRecipes = async (page) => {
  isFetching.value = true;
  const { from, to } = getPagination(page, 20);
  let { data: recipes, error } = await supabase.from('recipes').select('*').range(from, to);

  if (recipes.length === 0) {
    isFetching.value = false;
    currentPage.value -= 1;
    return;
  } else {
    fetchedRecipes.value = recipes;
  }

  if (error) {
    alert(error.message);
  }
  isFetching.value = false;
};

onBeforeMount(() => {
  fetchRecipes(currentPage.value);
});
</script>

<template>
  <div class="overflow-auto">
    <Navbar class="sticky top-0 h-fit bg-light-background" />
    <div class="p-4 md:px-8">
      <h3 class="mb-2 text-2xl font-medium">Your recipes</h3>
      <RouterLink to="/new-recipe">
        <button
          class="mb-3 w-fit rounded-md bg-light-green-500 px-3 py-1 font-semibold text-light-background hover:bg-light-green-600"
        >
          Add new recipe
        </button>
      </RouterLink>
      <div v-if="!isFetching">
        <div class="grid h-full w-full grid-cols-4 gap-4" v-if="fetchedRecipes.length !== 0">
          <div
            v-for="recipe in fetchedRecipes"
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
          v-if="fetchedRecipes.length !== 0"
          @next-page="getNextPage()"
          @previous-page="getPreviousPage()"
          class="mt-4"
        />
      </div>
      <IconSpinner v-else class="m-auto mt-4 !h-12 !w-12 fill-light-text" />
    </div>
  </div>
</template>
