<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

onMounted(() => {
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Recipe deleted',
    life: 3000,
  });

  router.push('/user');
});
</script>

<template>
  <div></div>
</template>
