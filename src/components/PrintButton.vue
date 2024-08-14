<script setup>
import { ref } from 'vue';
import { VueToPrint } from 'vue-to-print';

import IconPrinter from '@/components/icons/IconPrinter.vue';
import IconSpinner from '@/components/icons/IconSpinner.vue';

const props = defineProps({
  recipeTitle: String,
  content: Object,
});

const isLoading = ref(false);

const getComponentToPrint = () => {
  return props.content;
};

const handleOnBeforeGetContent = () => {
  isLoading.value = true;

  return new Promise((resolve) => {
    setTimeout(() => {
      isLoading.value = false;

      resolve();
    }, 2000);
  });
};
</script>

<template>
  <VueToPrint
    :content="getComponentToPrint"
    :document-title="`${props.recipeTitle}`"
    :on-before-get-content="handleOnBeforeGetContent"
    remove-after-print
    :page-style="''"
  >
    <template #trigger>
      <button class="flex items-center gap-1 p-2 hover:rounded-md hover:bg-light-text/10">
        <IconPrinter class="size-6" />
        <p class="font-medium" v-if="!isLoading">Print</p>
        <IconSpinner v-else class="fill-light-text" />
      </button>
    </template>
  </VueToPrint>
</template>
