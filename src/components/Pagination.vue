<script setup>
import IconCaretLeft from './icons/IconCaretLeft.vue';
import IconCaretRight from './icons/IconCaretRight.vue';

defineEmits(['nextPage', 'previousPage']);
</script>

<template>
  <div class="flex w-full items-center justify-center gap-4">
    <div @click="$emit('previousPage')" class="x group flex items-center hover:cursor-pointer">
      <IconCaretLeft class="size-6 fill-light-text" />
      <p class="group-hover:font-medium">Previous</p>
    </div>
    <div @click="$emit('nextPage')" class="group flex items-center hover:cursor-pointer">
      <p class="group-hover:font-medium">Next</p>
      <IconCaretRight class="size-6 fill-light-text" />
    </div>
  </div>
</template>
