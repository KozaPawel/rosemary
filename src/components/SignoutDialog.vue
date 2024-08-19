<script setup>
import { ref } from 'vue';

import Dialog from 'primevue/dialog';
import IconSpinner from '@/components/icons/IconSpinner.vue';

const props = defineProps({
  isSigningOut: Boolean,
});

const visible = ref(false);

defineEmits(['signOut']);
</script>

<template>
  <div>
    <button
      @click="visible = true"
      type="button"
      class="w-fit rounded-md border border-light-green-500 px-3 py-1 font-semibold text-light-green-500 hover:bg-light-green-500 hover:text-light-background"
    >
      Sign Out
    </button>

    <Dialog
      v-model:visible="visible"
      modal
      header="Are you sure?"
      :style="{ width: '25rem' }"
      :draggable="false"
      class="!bg-light-background !text-light-text"
    >
      <span class="mb-2 block text-gray-500">You will be Signed Out from your account.</span>
      <div class="flex gap-2">
        <button
          @click="visible = false"
          class="w-full rounded-md border border-gray-500 px-3 py-1 text-light-text hover:bg-gray-500 hover:text-light-background"
          :disabled="props.isSigningOut"
        >
          Cancel
        </button>
        <button
          @click="$emit('signOut')"
          class="w-full rounded-md bg-red-600 px-3 py-1 text-light-background hover:bg-red-700"
          :disabled="props.isSigningOut"
        >
          <p v-if="!isSigningOut">Sign Out</p>
          <IconSpinner v-else class="m-auto" />
        </button>
      </div>
    </Dialog>
  </div>
</template>

<style>
.p-button {
  color: #6b7280 !important;
}

.p-button:hover {
  background-color: #1414141a !important;
}
</style>
