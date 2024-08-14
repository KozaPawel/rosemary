<script setup>
import { RouterView, useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';

const route = useRoute();
</script>

<template>
  <div class="h-svh w-screen overflow-auto bg-light-background text-light-text">
    <Navbar class="sticky top-0 bg-light-background" v-if="route.meta.auth" />
    <RouterView />
  </div>
</template>
