<template>
  {{ label }}
  <input
    type="datetime-local"
    :value="forms[store].structure[field].value"
    @change="updateValue($event.target.value)"
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
    let { required, minDate, maxDate, moreThanField } = validation
    if (required && !value) {
      return true
    }

    const date = new Date(value)

    if(minDate && minDate === 'today'){
      minDate = new Date()
    }else if(minDate && minDate === 'now'){
      minDate = new Date(Date.now())
    }else if(minDate){
      minDate = new Date(minDate)
    }
    if (minDate && date < minDate) {
      return true
    }

    if(maxDate && maxDate === 'today'){
      maxDate = new Date()
    }else if(maxDate && maxDate === 'now'){
      maxDate = new Date(Date.now())
    }else if(maxDate){
      maxDate = new Date(maxDate)
    }
    if (maxDate && date > maxDate) {
      return true
    }

    if(moreThanField){
      const moreThanFieldValue = forms.value[store].structure[moreThanField].value
      if(moreThanFieldValue && date < new Date(moreThanFieldValue)){
        return true
      }
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
  setValue(store, field, value)
  setErrors(store, field, errors.value)
}

onMounted(() => {
  setErrors(store, field, errors.value)
})

</script>