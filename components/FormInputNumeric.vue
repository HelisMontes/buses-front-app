<template>
  {{ label }}
  <input
    type="number"
    v-model="modelValue"
    @input="updateValue"
  />
  <template
    v-if="errors.length && validated"
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
    if (min && modelValue.value < min) {
      return true
    }
    if (max && modelValue.value > max) {
      return true
    }
    return false
  }).map(validation => validation.message)
})

const validated = ref(false)

const updateValue = (e) => {
  modelValue.value = parseFloat(e.target.value)
  validated.value = true
  emit('update', {
    value: modelValue,
    errors,
    isValid: errors.value.length === 0,
  })
}

</script>
