<script setup>
import IconEdit from './icons/IconEdit.vue';

defineEmits(['editRecipe']);
</script>

<template>
  <div>
    <button
      @click="$emit('editRecipe')"
      class="flex items-center p-2 hover:rounded-md hover:bg-light-text/10"
    >
      <IconEdit class="size-6" />
      <p class="font-medium">Edit</p>
    </button>
  </div>
</template>
