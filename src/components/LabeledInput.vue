<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  required: {
    type: Boolean,
    default: false,
  },
  id: String,
  label: String,
  modelValue: String,
  placeholder: String,
  error: Boolean,
  smallText: String,
});

const updateValue = (event) => {
  emit('update:modelValue', event.target.value);
};

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="flex flex-col">
    <label :for="props.id">{{ props.label }}</label>
    <input
      :id="props.id"
      :value="props.modelValue"
      :type="props.type"
      :placeholder="props.placeholder"
      @input="updateValue"
      :required="props.required"
      class="rounded-md border border-light-text bg-light-background px-2 py-1 placeholder:text-gray-500"
      :class="{ 'border-red-600': props.error }"
    />
    <text v-if="props.smallText" class="mt-1 text-sm text-gray-500">{{ props.smallText }}</text>
  </div>
</template>
