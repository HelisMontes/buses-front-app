<template>
  {{ label }}
  <input
    type="text"
    v-model="modelValue"
    @input="updateValue"
  />
  <template
    v-if="errors.length && !isValidRef"
  >
    <div>
      {{ errors }}
    </div>
  </template>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['update'])

const {
  label,
  field,
  validations,
  value,
  isValid,
} = defineProps({
  label: {
    type: String,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
  validations: {
    type: Array,
    default: () => [],
  },
  value: {
    type: String,
    default: '',
  },
  isValid: {
    type: Boolean,
    default: true,
  },
})

const modelValue = ref(value)

const errors = computed(() => {
  return validations.filter(validation => {
    const { required, min, max } = validation
    if (required && !modelValue.value) {
      return true
    }
    if (min && modelValue.value.length < min) {
      return true
    }
    if (max && modelValue.value.length > max) {
      return true
    }
    return false
  }).map(validation => validation.message)
})

const isValidRef = ref(isValid)

const updateValue = (e) => {
  modelValue.value = e.target.value
  isValidRef.value = errors.value.length === 0
  emit('update', {
    value: modelValue.value,
    isValid: errors.value.length === 0,
  })
}

</script>
