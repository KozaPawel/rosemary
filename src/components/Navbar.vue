<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase';
import { RouterLink } from 'vue-router';

import SignoutDialog from '@/components/SignoutDialog.vue';

const router = useRouter();
const isSigningOut = ref(false);

const signOut = async () => {
  try {
    isSigningOut.value = true;
    const { error } = await supabase.auth.signOut();

    if (error) {
      isSigningOut.value = false;
      throw error;
    }

    router.push('/login');
  } catch (error) {
    alert(error.message);
  } finally {
    isSigningOut.value = false;
  }
};
</script>

<template>
  <div
    class="z-10 flex flex-row items-center justify-between px-4 py-4 shadow shadow-light-text/20 md:px-8"
  >
    <RouterLink to="/user" class="text-2xl font-bold text-light-green-500 hover:underline">
      Rosemary
    </RouterLink>
    <SignoutDialog @sign-out="signOut()" :is-signing-out="isSigningOut" />
  </div>
</template>
