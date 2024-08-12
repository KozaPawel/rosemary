<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { supabase } from '@/supabase';

import Navbar from '@/components/Navbar.vue';
import Recipe from '@/components/Recipe.vue';
import IconNothingFound from '@/components/icons/IconNothingFound.vue';

const recipeId = useRoute().params.id;
const recipe = ref({});

onBeforeMount(async () => {
  let { data, error } = await supabase.from('recipes').select('*').eq('id', recipeId);
  recipe.value = data;

  if (error) {
    alert(error.message);
  }
});
</script>

<template>
  <div class="overflow-auto">
    <Navbar class="sticky top-0 bg-light-background" />
    <div class="my-4 px-4 md:px-8">
      <Recipe :recipe="recipe[0]" v-if="recipe[0]" />
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
  </div>
</template>
