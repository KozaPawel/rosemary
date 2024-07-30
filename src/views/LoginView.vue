<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase';

import IconEye from '@/components/icons/IconEye.vue';
import IconEyeClose from '@/components/icons/IconEyeClose.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import Auth from '@/components/Auth.vue';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const passwordType = ref('password');
const showPassword = ref(false);
const showError = ref(false);

const signInWithPassword = async () => {
  errorMessage.value = '';
  showError.value = false;

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = error.message;
    showError.value = true;
    return;
  }

  router.push('user');
};

const changePasswordType = () => {
  if (passwordType.value === 'password') {
    passwordType.value = 'text';
    showPassword.value = true;
  } else {
    passwordType.value = 'password';
    showPassword.value = false;
  }
};
</script>

<template>
  <Auth :is-login-form="true">
    <form @submit.prevent="signInWithPassword()" class="flex flex-col gap-2">
      <h3 class="text-3xl font-bold">Welcome back!</h3>
      <div class="flex flex-col">
        <label for="email">Email address</label>
        <input
          v-model="email"
          id="email"
          class="rounded-md border border-light-text bg-light-background px-2 py-1 placeholder:text-gray-500"
          :class="{ 'border-red-600': showError }"
          type="email"
          placeholder="Enter your email address"
          required
        />
      </div>
      <div class="flex flex-col">
        <label for="password">Password</label>
        <div class="relative flex items-center justify-between">
          <input
            v-model="password"
            id="password"
            class="w-full rounded-md border border-light-text bg-light-background px-2 py-1 placeholder:text-gray-500"
            :class="{ 'border-red-600': showError }"
            :type="passwordType"
            placeholder="******"
            required
          />
          <button
            type="button"
            class="absolute end-2 hover:cursor-pointer"
            @click.prevent="changePasswordType()"
          >
            <component class="size-6" :is="showPassword ? IconEyeClose : IconEye" />
          </button>
        </div>
      </div>
      <ErrorMessage v-if="showError" :message="errorMessage" />
      <button
        type="submit"
        class="mt-2 w-fit rounded-md bg-light-text px-3 py-1 text-light-background hover:bg-light-text/80"
      >
        Log in
      </button>
    </form>
  </Auth>
</template>
