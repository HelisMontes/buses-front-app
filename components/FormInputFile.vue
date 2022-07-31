<template>
  {{ label }}
  <input
    type="file"
    @input="updateValue"
    ref="file"
  />
  <Image
    v-if="forms[store].structure[field].type === 'image' && forms[store].structure[field].fileOld"
    :src="forms[store].structure[field].fileOld"
  />
  <template
    v-if="
      forms[store].structure[field].errors.length &&
      forms[store].structure[field].errors[0] &&
      forms[store].isValidated
    "
  >
    <div>
      {{ forms[store].structure[field].errors }}
    </div>
  </template>
</template>

<script setup>
import { watch, computed, ref } from 'vue'

import { storeToRefs } from 'pinia'

import Image from '@/components/Image.vue'

import { useFormConfigStore } from '@/stores/formConfig'

const formConfigStore = useFormConfigStore()
const { forms } = storeToRefs(formConfigStore)
const { setValue, setErrors } = formConfigStore

const { label, value } = storeToRefs(forms.value[store].structure[field])

const file = ref(null)

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

watch(() => forms.value[store].structure[field].value, (currentValue, oldValue) => {
  console.log('oldValue', oldValue.slice(0, 15));
  console.log('currentValue', currentValue.slice(0, 15));
  oldValue = oldValue.slice(0, 15);
  currentValue = currentValue.slice(0, 15);
  if (oldValue !== currentValue && !currentValue) {
    file.value.type = 'text'
    file.value.type = 'file'
  }
});

const updateValue = (e) => {
  const value = e.target.files[0]
  if(!value) return
  getBase64(value).then(base64 => {
    setValue(store, field, base64)
    setErrors(store, field, errors.value)
  })
}

</script>
