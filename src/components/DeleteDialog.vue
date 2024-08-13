<script setup>
import { ref } from 'vue';

import Dialog from 'primevue/dialog';
import IconTrash from './icons/IconTrash.vue';
import IconSpinner from './icons/IconSpinner.vue';

const props = defineProps({
  isDeleting: Boolean,
});

const visible = ref(false);

defineEmits(['deleteConfirmed']);
</script>

<template>
  <div>
    <button
      @click="visible = true"
      class="flex items-center p-2 hover:rounded-md hover:bg-light-text/10"
    >
      <IconTrash class="size-6" />
      <p class="font-medium">Delete</p>
    </button>
    <Dialog
      v-model:visible="visible"
      modal
      header="Are you sure?"
      :style="{ width: '25rem' }"
      :draggable="false"
      class="!bg-light-background !text-light-text"
    >
      <span class="mb-2 block text-gray-500">Deleted recipes cannot be recovered</span>
      <div class="flex gap-2">
        <button
          @click="visible = false"
          class="w-full rounded-md border border-gray-500 px-3 py-1 text-light-text hover:bg-gray-500 hover:text-light-background"
          :disabled="props.isDeleting"
        >
          Cancel
        </button>
        <button
          @click="$emit('deleteConfirmed')"
          class="w-full rounded-md bg-red-600 px-3 py-1 text-light-background hover:bg-red-700"
          :disabled="props.isDeleting"
        >
          <p v-if="!isDeleting">Delete</p>
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
