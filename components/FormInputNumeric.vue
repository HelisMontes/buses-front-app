<template>
  <div class="form-group">
    <label :for="`label-${label}`">{{ label }}</label>
    <input
      type="number"
      :value="forms[store].structure[field].value"
      @keyup="updateValue($event.target.value)"
      class="input-number"
      :placeholder="label"
    />
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
    const { required, min, max } = validation
    if (required && !value) {
      return true
    }
    if (min && value < min) {
      return true
    }
    if (max && value > max) {
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

const updateValue = (value) => {
  setValue(store, field, parseFloat(value))
  setErrors(store, field, errors.value)
}

onMounted(() => {
  setErrors(store, field, errors.value)
})

</script>
