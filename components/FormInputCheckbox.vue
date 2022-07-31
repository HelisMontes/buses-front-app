<template>
  {{ label }}
  <input
    type="checkbox"
    v-model="modelValue"
    @change="updateValue"
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
    const { required } = validation
    if (required && !typeof modelValue.value === 'boolean') {
      return true
    }
    return false
  }).map(validation => validation.message)
})

const validated = ref(false)

const updateValue = (e) => {
  modelValue.value = e.target.checked
  validated.value = true
  emit('update', {
    value: modelValue,
    isValid: errors.value.length === 0,
  })
}

</script>
