<script setup>
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase';

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
    <text class="text-light-green-500 text-2xl font-bold">Rosemary</text>
    <button
      @click="signOut()"
      type="button"
      class="bg-light-green-500 hover:bg-light-green-600 w-fit rounded-md px-3 py-1 font-semibold text-light-background"
    >
      Sign Out
    </button>
  </div>
</template>
