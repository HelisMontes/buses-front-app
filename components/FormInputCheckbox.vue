<template>
  {{ label }}
  <input
    type="checkbox"
    v-model="modelValue"
    @change="updateValue"
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
    const { required } = validation
    if (required && !typeof modelValue.value === 'boolean') {
      return true
    }
    return false
  }).map(validation => validation.message)
})

const isValidRef = ref(isValid)

const updateValue = (e) => {
  console.log('updateValue', e.target.checked)
  modelValue.value = e.target.checked
  isValidRef.value = errors.value.length === 0
  emit('update', {
    value: modelValue.value,
    isValid: errors.value.length === 0,
  })
}

</script>
