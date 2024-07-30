<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  isLoginForm: Boolean,
});
</script>

<template>
  <div class="flex h-screen w-screen flex-row">
    <div class="hidden h-full w-2/3 md:block">
      <img src="@/assets/auth-bg.png" class="pointer-events-none h-full w-full object-cover" />
    </div>
    <div class="mt-24 flex h-full w-full flex-col p-4 md:mt-0 md:w-1/3 md:justify-center">
      <slot></slot>
      <div class="mt-2 w-fit hover:cursor-pointer">
        <text @click="router.push('signup')" v-if="props.isLoginForm" class="group font-medium"
          >Don't have and account?
          <text class="text-light-accent group-hover:underline">Sign up</text></text
        >
        <text @click="router.push('login')" v-else class="group font-medium"
          >Already have an account?
          <text class="text-light-accent group-hover:underline">Log in</text></text
        >
      </div>
    </div>
  </div>
</template>
