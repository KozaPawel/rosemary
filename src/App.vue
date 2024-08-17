<script setup>
import { RouterView, useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';

const route = useRoute();

const unmountUserView = () => {
  let unmount = false;

  if (route.name !== 'recipe' && route.name !== 'user') {
    unmount = true;
  }

  return unmount ? 'UserView' : '';
};
</script>

<template>
  <div class="h-dvh w-screen overflow-auto bg-light-background text-light-text">
    <Navbar class="sticky top-0 bg-light-background" v-if="route.meta.auth" />
    <RouterView v-slot="{ Component }">
      <KeepAlive :include="'UserView'" :exclude="unmountUserView()">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </div>
</template>
