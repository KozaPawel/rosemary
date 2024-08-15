<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { supabase } from '@/supabase';

import Recipe from '@/components/Recipe.vue';
import IconNothingFound from '@/components/icons/IconNothingFound.vue';
import IconSpinner from '@/components/icons/IconSpinner.vue';
import DeleteDialog from '@/components/DeleteDialog.vue';
import EditButton from '@/components/EditButton.vue';
import PrintButton from '@/components/PrintButton.vue';

const router = useRouter();
const recipeId = useRoute().params.id;
const recipe = ref({});
const isFetching = ref(false);
const isDeleting = ref(false);
const printContentRef = ref();

const deleteRecipe = async () => {
  try {
    isDeleting.value = true;
    const { error } = await supabase.from('recipes').delete().eq('id', recipeId);

    if (error) {
      throw error;
    }

    router.push('/user');
  } catch (error) {
    alert(error.message);
  } finally {
    isDeleting.value = false;
  }
};

const fetchRecipe = async () => {
  try {
    isFetching.value = true;
    let { data, error } = await supabase.from('recipes').select('*').eq('id', recipeId);
    recipe.value = data[0];

    if (error) {
      throw error;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    isFetching.value = false;
  }
};

onBeforeMount(() => {
  fetchRecipe();
});
</script>

<template>
  <div>
    <div class="mt-4 flex flex-wrap justify-center gap-2" v-if="recipe && !isFetching">
      <EditButton @edit-recipe="router.push(`/edit/${recipeId}`)" />
      <PrintButton :recipe-title="`${recipe.title}`" :content="printContentRef" />
      <DeleteDialog @delete-confirmed="deleteRecipe()" :is-deleting="isDeleting" />
    </div>
    <div class="my-4 px-4 md:px-8" v-if="!isFetching">
      <div v-if="recipe" ref="printContentRef">
        <Recipe :recipe="recipe" />
      </div>
      <div v-else class="flex flex-col items-center justify-center">
        <IconNothingFound class="max-h-96" />
        <p class="text-2xl">There's no recipe to show</p>
        <RouterLink :to="'/user'">
          <button
            class="mt-2 w-fit rounded-md bg-light-green-500 px-3 py-1 font-semibold text-light-background hover:bg-light-green-600"
          >
            Go to homepage
          </button>
        </RouterLink>
      </div>
    </div>
    <IconSpinner v-else class="m-auto mt-4 !h-12 !w-12 fill-light-text" />
  </div>
</template>
