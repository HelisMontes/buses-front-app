<template>
  {{ label }}
  <input
    :list="store + '-' + field"
    :value="valueToShow"
    @change="updateValue($event.target.value)"
  >
  <button
    @click.stop.prevent="updateValue('')"
  >
    X
  </button>
  <datalist :id="store + '-' + field">
    <option v-for="(option, key) in options" :key="key" :value="option.label">{{ option?.description }}</option>
  </datalist>
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
</template>

<script setup>
import { computed } from 'vue'

import { storeToRefs } from 'pinia'

import { useFormConfigStore } from '@/stores/formConfig'

const formConfigStore = useFormConfigStore()
const { forms } = storeToRefs(formConfigStore)
const { setValue, setErrors } = formConfigStore

const { label, options } = forms.value[store].structure[field]

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
    if (required && !value) {
      return true
    }
    return false
  }).map(validation => validation.message)
})

watch(() => forms.value[store].structure[field].value, (currentValue, oldValue) => {
  if (oldValue !== currentValue && !currentValue) {
    valueToShow.value = ''
    setErrors(store, field, errors.value)
  }else if (oldValue !== currentValue && currentValue) {
    valueToShow.value = options[currentValue].label
    setErrors(store, field, errors.value)
  }
});

const valueToShow = ref('')

const updateValue = (label) => {
  valueToShow.value = label
  let value = ''
  for(const key in options) {
    const option = options[key]
    if (option.label === label) {
      value = key
      break
    }
  }
  setValue(store, field, value)
  setErrors(store, field, errors.value)
}

onMounted(() => {
  setErrors(store, field, errors.value)
})

</script>
