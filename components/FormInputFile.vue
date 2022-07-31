<template>
  {{ label }}
  <input
    type="file"
    :value="forms[store].structure[field].value"
    @input="updateValue"
  />
  <template
    v-if="forms[store].structure[field].errors.length && forms[store].isValidated"
  >
    <div>
      {{ forms[store].structure[field].errors }}
    </div>
  </template>
</template>

<script setup>
import { computed } from 'vue'

import { storeToRefs } from 'pinia'

import { useFormConfigStore } from '@/stores/formConfig'

const formConfigStore = useFormConfigStore()
const { forms } = storeToRefs(formConfigStore)
const { setValue, setErrors } = formConfigStore

const { label } = forms.value[store].structure[field]

const {
  store,
  field,
} = defineProps({
  store: {
    type: String,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
})

const validateBase64 = (typeToValidate, value) => {
  if(!value) return true
  const isValid = value.startsWith('data:image/')
  if (!isValid) {
    return false
  }
  const [type,] = value.split(';')
  const [, extension] = type.split('/')
  const isValidExtension = typeToValidate.includes(extension)
  return isValidExtension
}

const getBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => resolve(reader.result)
  reader.onerror = error => reject(error)
})

const errors = computed(() => {
  const { validations, value } = forms.value[store].structure[field]
  return validations.filter(validation => {
    const { required, type } = validation
    if (required && !value) {
      return true
    }
    if (type && !validateBase64(type, value)) {
      return true
    }
    return false
  }).map(validation => validation.message)
})

const updateValue = (e) => {
  const value = e.target.files[0]
  getBase64(value).then(base64 => {
    setValue(store, field, base64)
    setErrors(store, field, errors.value)
  })
}

</script>
