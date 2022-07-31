<template>
  <form>
    <template
      v-for="(item, index) in formItems"
      :key="index"
    >
      <br/>
      <br/>
      <component
        :is="callComponent[item.component]({
          store: name,
          field: index,
        })"
      />
    </template>
    <br/>
    <Button
      text="Guardar"
      @click="submit"
    />
  </form>
</template>

<script setup>
import Button from '~/components/Button.vue'

import callComponent from '@/utils/callComponent'

import { storeToRefs } from 'pinia'

import { useFormConfigStore } from '@/stores/formConfig'

const formConfigStore = useFormConfigStore()
const { setForm, setFormValidated, getValues, setErrorsList } = formConfigStore
const { forms } = storeToRefs(formConfigStore)

const emit = defineEmits(['submit'])

const {
  name,
  structure,
} = defineProps({
  name: {
    type: String,
    required: true,
  },
  structure: {
    type: Object,
    default() {
      return {}
    }
  },
})

const formItems = computed(() => {
  return forms?.value?.[name]?.structure || {}
})

const formIsValid = computed(() => {
  for(const key in forms?.value?.[name].structure) {
    const item = forms?.value?.[name].structure[key]
    if(item.errors.length) {
      console.log('item', item)
      return false
    }
  }
  return true
})

const submit = () => {
  setFormValidated(name, true)
  const isValid = formIsValid.value
  console.log('isValid', isValid)
  if(!isValid) return
  const values = getValues(name)
  console.log('submit -> values', values)
  emit('submit', values)
}

const setErrors = (errors) => {
  console.log('setErrors', errors)
  setErrorsList(name, errors)
}
const reset = (structure) => {
  console.log('reset')
  setForm(name, { structure })
}
defineExpose({
  setErrors,
  reset,
});

onMounted(() => {
  setForm(name, { structure })
})

</script>
