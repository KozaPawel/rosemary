<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  isLoginForm: Boolean,
});

const router = useRouter();
</script>

<template>
  <div class="flex h-screen w-screen flex-row items-start md:items-center">
    <div class="hidden h-full w-1/2 md:block lg:w-2/3">
      <img src="@/assets/auth-bg.webp" class="pointer-events-none h-full w-full object-cover" />
    </div>
    <div class="mt-24 flex h-fit w-full flex-col p-4 md:mt-0 md:w-1/2 md:justify-center lg:w-1/3">
      <slot></slot>
      <div class="mt-2 w-fit hover:cursor-pointer">
        <text @click="router.push('signup')" v-if="props.isLoginForm" class="group font-medium"
          >Don't have and account?
          <text class="text-light-green-500 group-hover:underline">Sign up</text></text
        >
        <text @click="router.push('login')" v-else class="group font-medium"
          >Already have an account?
          <text class="text-light-green-500 group-hover:underline">Log in</text></text
        >
      </div>
    </div>
  </div>
</template>
