<template>
  <form>
    <slot></slot>
    <br/>
    <Button
      text="Guardar"
      @click="$emit('submit')"
    />
  </form>
</template>

<script setup>
import Button from '~/components/Button.vue'

defineEmits(['submit'])

</script>
