<template>
  <form>
    <div
      v-if="forms?.[name]?.errors?.length"
    >
      <div
        v-for="error in forms[name].errors"
        :key="error"
      >
        {{ error }}
      </div>
    </div>
    <template
      v-for="(item, index) in formItems"
      :key="index"
    >
    <component
        v-if="item.component"
        :is="callComponent[item.component]({
          store: name,
          field: index,
        })"
      />
    </template>

    <Button
      :text="submitText"
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
const { setForm, setFormValidated, getValues, setErrorsList, setData: setFormData, setErrorsGeneral } = formConfigStore
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
  submitText: {
    type: String,
    default: 'Guardar',
  },
})

const formItems = computed(() => {
  return forms?.value?.[name]?.structure || {}
})

const formIsValid = computed(() => {
  for(const key in forms?.value?.[name].structure) {
    const item = forms?.value?.[name].structure[key]
    if(item?.errors?.length) {
      console.log('item', item)
      return false
    }
  }
  return true
})

const submit = () => {
  setFormValidated(name, true)
  const isValid = formIsValid.value
  if(!isValid) return
  const values = getValues(name)
  emit('submit', values)
}

const setErrors = (errors) => {
  setErrorsList(name, errors)
}
const reset = (structure) => {
  setForm(name, { structure })
  setErrorsGeneral(name, [])
}
const setData = (data) => {
  setFormData(name, { data })
}
defineExpose({
  setErrors,
  reset,
  setData,
});

onMounted(() => {
  setForm(name, { structure })
})

</script>
