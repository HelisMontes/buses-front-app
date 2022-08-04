<template>
  <div class="form-group">
    <div class="checkbox">
      <label :for="`label-${label}`">{{ label }}</label>
      <input
        type="checkbox"
        :checked="forms[store].structure[field].value"
        :value="forms[store].structure[field].value"
        @change="updateValue"
      />
    </div>
    <template
      v-if="
        forms[store].structure[field].errors.length &&
        forms[store].structure[field].errors[0] &&
        forms[store].isValidated
      "
    >
      <div class="message-error">
        <span v-for="(error, key) in forms[store].structure[field].errors" :key="key">
          {{ error }}
        </span>
      </div>
    </template>
  </div>
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

watch(() => forms.value[store].structure[field].value, (currentValue, oldValue) => {
  if (oldValue !== currentValue && !currentValue) {
    setErrors(store, field, errors.value)
  }
});

const updateValue = (event) => {
  const value = event.target.checked
  setValue(store, field, value)
  setErrors(store, field, errors.value)
}

onMounted(() => {
  setErrors(store, field, errors.value)
})

</script>
