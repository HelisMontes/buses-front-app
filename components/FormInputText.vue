<template>
  {{ label }}
  <input
    type="text"
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
  <template
    v-if="props.errors.length"
  >
    <div>
      {{ props.errors }}
    </div>
  </template>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['update'])

const props = defineProps({
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
  errors: {
    type: Array,
    default: () => [],
  },
  value: {
    type: String,
    required: true,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
})


const {
  label,
  field,
  validations,
  isValid,
} = props

console.log('props.value', props.value)

const modelValue = ref(props.value)
const modelErrors = ref(props.errors)

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

const validated = ref(false)

const updateValue = (e) => {
  modelValue.value = e.target.value
  modelErrors.value = errors.value
  validated.value = true
  emit('update', {
    value: modelValue,
    errors: modelErrors,
    isValid: errors.value.length === 0,
  })
}

</script>
