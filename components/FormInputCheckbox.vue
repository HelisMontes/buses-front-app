<template>
  {{ label }}
  <input
    type="checkbox"
    :checked="forms[store].structure[field].value"
    :value="forms[store].structure[field].value"
    @change="updateValue"
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
    const { required } = validation
    if (required && value === undefined) {
      return true
    }
    return false
  }).map(validation => validation.message)
})

const updateValue = (event) => {
  const value = event.target.checked
  setValue(store, field, value)
  setErrors(store, field, errors.value)
}

</script>
