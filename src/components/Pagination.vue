<script setup>
import IconCaretLeft from './icons/IconCaretLeft.vue';
import IconCaretRight from './icons/IconCaretRight.vue';

defineEmits(['nextPage', 'previousPage']);
</script>

<template>
  <div class="flex w-full items-center justify-center gap-4">
    <div
      @click="$emit('previousPage')"
      class="flex select-none items-center p-2 hover:cursor-pointer hover:rounded-md hover:bg-light-text/10"
    >
      <IconCaretLeft class="size-6 fill-light-text" />
      <p class="font-medium">Previous</p>
    </div>
    <div
      @click="$emit('nextPage')"
      class="flex select-none items-center p-2 hover:cursor-pointer hover:rounded-md hover:bg-light-text/10"
    >
      <p class="font-medium">Next</p>
      <IconCaretRight class="size-6 fill-light-text" />
    </div>
  </div>
</template>
