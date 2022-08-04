<template>
  <img 
    v-if="src"
    :src="`${API_BASE_URL}/images/${src}`"
    :alt="alt"
    width="100"
    height="100"
  />
</template>

<script setup>
const { src, alt } = defineProps(['src', 'alt'])

const { API_BASE_URL } = useRuntimeConfig()
</script>
