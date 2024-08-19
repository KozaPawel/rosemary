<script setup>
import IconEdit from '@/components/icons/IconEdit.vue';

defineEmits(['editRecipe']);
</script>

<template>
  <button
    @click="$emit('editRecipe')"
    class="flex items-center gap-1 p-2 hover:rounded-md hover:bg-light-text/10"
  >
    <IconEdit class="size-6" />
    <p class="font-medium">Edit</p>
  </button>
</template>
