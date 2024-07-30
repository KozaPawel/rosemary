<script setup>
import { onMounted, ref } from 'vue';
import { supabase } from '@/supabase';
import { useRouter } from 'vue-router';

const router = useRouter();
const userInfo = ref(null);

const getProfile = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  userInfo.value = session.user;
};

const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  router.push('login');
};

onMounted(() => {
  getProfile();
});
</script>

<template>
  <div class="h-screen w-screen">
    <div>
      <text>Account</text>
      <p>{{ userInfo }}</p>
    </div>
    <button @click="signOut()" class="font-semibold">Sign Out</button>
  </div>
</template>
