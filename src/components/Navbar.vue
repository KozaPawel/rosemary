<script setup>
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase';
import { RouterLink } from 'vue-router';

const router = useRouter();

const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  router.push('login');
};
</script>

<template>
  <div
    class="flex flex-row items-center justify-between px-4 py-4 shadow shadow-light-text/20 md:px-8"
  >
    <RouterLink to="/user" class="text-2xl font-bold text-light-green-500 hover:underline">
      Rosemary
    </RouterLink>
    <button
      @click="signOut()"
      type="button"
      class="w-fit rounded-md border border-light-green-500 px-3 py-1 font-semibold text-light-green-500 hover:bg-light-green-500 hover:text-light-background"
    >
      Sign Out
    </button>
  </div>
</template>
