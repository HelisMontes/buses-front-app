<template>
  {{ label }}
  <input
    type="file"
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

const validateBase64 = (typeToValidate) => {
  if(!modelValue.value) return true
  const isValid = modelValue.value.startsWith('data:image/')
  if (!isValid) {
    return false
  }
  const [type,] = modelValue.value.split(';')
  const [, extension] = type.split('/')
  const isValidExtension = typeToValidate.includes(extension)
  return isValidExtension
}

const errors = computed(() => {
  return validations.filter(validation => {
    const { required, type } = validation
    if (required && !modelValue.value) {
      return true
    }
    if (type && !validateBase64(type)) {
      return true
    }
    return false
  }).map(validation => validation.message)
})

const isValidRef = ref(isValid)

const getBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => resolve(reader.result)
  reader.onerror = error => reject(error)
})

const updateValue = (e) => {
  getBase64(e.target.files[0]).then(base64 => {
    modelValue.value = base64
    isValidRef.value = errors.value.length === 0
    emit('update', {
      value: modelValue.value,
      isValid: errors.value.length === 0,
    })
  })
}

</script>
