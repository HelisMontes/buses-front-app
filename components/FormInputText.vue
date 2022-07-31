<template>
  {{ label }}
  <input
    type="text"
    :value="forms[store].structure[field].value"
    @keyup="updateValue($event.target.value)"
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

const errors = computed(() => {
  const { validations, value } = forms.value[store].structure[field]
  return validations.filter(validation => {
    const { required, min, max } = validation
    if (required && !value) {
      return true
    }
    if (min && value.length < min) {
      return true
    }
    if (max && value.length > max) {
      return true
    }
    return false
  }).map(validation => validation.message)
})

const updateValue = (value) => {
  setValue(store, field, value)
  setErrors(store, field, errors.value)
}

</script>
