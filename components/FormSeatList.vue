<template>
  {{ label }}
  {{ valueToShow }}
  <div v-for="(option, index) in optionsFree" :key="index">
    <div
      v-if="option"
      :class="['seat', 'seat-occupied']"
    >
      Ocupado
    </div>
    <div
      v-else @click="updateValue(index)"
      :class="['seat', (valueToShow === index ? 'seat-selected' : 'seat-free')]"
    >
      Libre
    </div>
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
</template>

<script setup>
import { computed } from 'vue'

import { storeToRefs } from 'pinia'

import { useFormConfigStore } from '@/stores/formConfig'

const formConfigStore = useFormConfigStore()
const { forms } = storeToRefs(formConfigStore)
const { setValue, setErrors } = formConfigStore

const { label, options } = forms.value[store].structure[field]

const optionsToObject = {}
options.forEach(option => {
  optionsToObject[option.number_seat] = option
})

const listOptions = [...Array(10)].map((_, i) => i+1);

const optionsFree = {}
listOptions.forEach(option => {
  optionsFree[option] = null
  if (optionsToObject[option]) {
    optionsFree[option] = optionsToObject[option]
  }
})

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
    setValue(store, field, '')
    setErrors(store, field, errors.value)
  }else if (oldValue !== currentValue && currentValue) {
    setErrors(store, field, errors.value)
  }
});

const valueToShow = ref('')

const updateValue = (value) => {
  valueToShow.value = value
  setValue(store, field, value)
  setErrors(store, field, errors.value)
}

onMounted(() => {
  setErrors(store, field, errors.value)
})

</script>
