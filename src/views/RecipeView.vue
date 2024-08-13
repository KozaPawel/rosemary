<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { supabase } from '@/supabase';

import Navbar from '@/components/Navbar.vue';
import Recipe from '@/components/Recipe.vue';
import IconNothingFound from '@/components/icons/IconNothingFound.vue';
import IconSpinner from '@/components/icons/IconSpinner.vue';
import DeleteDialog from '@/components/DeleteDialog.vue';
import EditButton from '@/components/EditButton.vue';

const router = useRouter();
const recipeId = useRoute().params.id;
const recipe = ref({});
const isFetching = ref(false);
const isDeleting = ref(false);

const deleteRecipe = async () => {
  isDeleting.value = true;
  const { error } = await supabase.from('recipes').delete().eq('id', recipeId);

  if (error) {
    alert(error.message);
  }

  router.push('/user');
  isDeleting.value = false;
};

onBeforeMount(async () => {
  isFetching.value = true;
  let { data, error } = await supabase.from('recipes').select('*').eq('id', recipeId);
  recipe.value = data[0];

  if (error) {
    alert(error.message);
  }
  isFetching.value = false;
});
</script>

<template>
  <div class="overflow-auto">
    <Navbar class="sticky top-0 bg-light-background" />
    <div class="mt-4 flex gap-2 md:justify-center" v-if="recipe && !isFetching">
      <EditButton @edit-recipe="router.push(`/edit/${recipeId}`)" />
      <DeleteDialog @delete-confirmed="deleteRecipe()" :is-deleting="isDeleting" />
    </div>
    <div class="my-4 px-4 md:px-8" v-if="!isFetching">
      <Recipe :recipe="recipe" v-if="recipe" />
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
