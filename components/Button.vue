<template>
  <button type="button" @click="$emit('click')">
    {{ text }}
  </button>
</template>

<script setup>

const emit = defineEmits(['click'])

const {
  text,
} = defineProps({
  text: {
    type: String,
    required: true,
  },
})

</script>
