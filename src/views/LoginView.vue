<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase';

import IconEye from '@/components/icons/IconEye.vue';
import IconEyeClose from '@/components/icons/IconEyeClose.vue';
import IconSpinner from '@/components/icons/IconSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import Auth from '@/components/Auth.vue';
import LabeledInput from '@/components/LabeledInput.vue';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const passwordType = ref('password');
const showPassword = ref(false);
const showError = ref(false);
const isLoggingIn = ref(false);

const signInWithPassword = async () => {
  isLoggingIn.value = true;
  errorMessage.value = '';
  showError.value = false;

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = error.message;
    showError.value = true;
    isLoggingIn.value = false;
    return;
  }

  router.push('user');
  isLoggingIn.value = false;
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
      <LabeledInput
        v-model="email"
        :id="'email'"
        :label="'Email address'"
        :required="true"
        :placeholder="'Enter your email address'"
        :type="'email'"
        :error="showError"
      />
      <div class="relative">
        <LabeledInput
          v-model="password"
          :id="'password'"
          :label="'Password'"
          :required="true"
          :placeholder="'******'"
          :type="passwordType"
          :error="showError"
          class="relative"
        ></LabeledInput>
        <button
          type="button"
          class="absolute end-2 top-[1.85rem] hover:cursor-pointer"
          @click.prevent="changePasswordType()"
        >
          <component class="size-6" :is="showPassword ? IconEyeClose : IconEye" />
        </button>
      </div>
      <ErrorMessage v-if="showError" :message="errorMessage" />
      <button
        type="submit"
        class="mt-2 w-fit rounded-md bg-light-green-500 px-3 py-1 font-semibold text-light-background hover:bg-light-green-600"
        :disabled="isLoggingIn"
      >
        <text v-if="!isLoggingIn">Log in</text>
        <IconSpinner v-else />
      </button>
    </form>
  </Auth>
</template>
