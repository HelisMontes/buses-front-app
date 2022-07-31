<template>
  <h1>Bus page</h1>
  <br />
  <br />
  <TableCustom
    v-if="false"
    :data="list.data || []"
    :meta="list.meta || {}"
    :columns="COLUMNS"
    @update-data="getAll"
    @update-per-page="updatePerPage"
    @update-page="updatePage"
  >
    <template v-slot:callback="{ data, field }">
      <template v-if="field === 'status'">
        <span v-if="data">Activo</span>
        <span v-else>Inactivo</span>
      </template>
      <template v-else-if="field === 'image'">
        <Image
          :src="data"
          alt="bus"
        />
      </template>
      <template v-else>
        {{ data }}
      </template>
    </template>
  </TableCustom>
  {{ createStatus }}
  <Form
    @submit="submit"
  >
    <template
      v-for="(item, index) in formItems"
      :key="index"
    >
      <br/>
      <br/>
      <component
        :is="callComponent[item.component](item)"
        @update="($event) => { item.value = $event.value; item.isValid = $event.isValid }"
      />
    </template>
  </Form>
  {{ formItems }}
  <br/>
  <br/>
  <br/>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useBusStore } from '@/stores/bus'

import callComponent from '@/utils/callComponent'

import TableCustom from '~/components/TableCustom.vue'
import Image from '~/components/Image.vue'
import Form from '~/components/Form.vue'

const busStore = useBusStore()
const { COLUMNS } = busStore
const { list, createStatus } = storeToRefs(busStore)

const { getAll, updatePerPage, updatePage, create } = busStore

const formItems = reactive({
  brand: {
    label: 'Marca',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' }
    ],
    value: '',
    errors: [],
    isValid: false,
    component: 'FormInputText',
  },
  model: {
    label: 'Modelo',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' }
    ],
    value: '',
    errors: [],
    isValid: false,
    component: 'FormInputText',
  },
  color: {
    label: 'Color',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' }
    ],
    value: '',
    errors: [],
    isValid: false,
    component: 'FormInputText',
  },
  plate: {
    label: 'Placa',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' }
    ],
    value: '',
    errors: [],
    isValid: false,
    component: 'FormInputText',
  },
  quantity_seats: {
    label: 'Cantidad de asientos',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 1, message: 'Mínimo 1' },
      { max: 10, message: 'Máximo 10' },
    ],
    value: '',
    errors: [],
    isValid: false,
    component: 'FormInputNumeric',
  },
  year: {
    label: 'Año',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 1950, message: 'Mínimo 1950' },
      { max: 2050, message: 'Máximo 2050' },
    ],
    value: '',
    errors: [],
    isValid: false,
    component: 'FormInputNumeric',
  },
  image: {
    label: 'Imagen',
    validations: [
      // { required: true, message: 'Este campo es requerido' },
      { type: ['webp', 'jpeg', 'jpg', 'png'], message: 'El archivo debe ser una imagen (webp, jpeg, jpg, png)' },
    ],
    value: '',
    errors: [],
    isValid: false,
    component: 'FormInputFile',
  },
  status: {
    label: 'Estado',
    validations: [
      { required: true, message: 'Este campo es requerido' },
    ],
    value: '',
    errors: [],
    isValid: false,
    component: 'FormInputCheckbox',
  },
})

const formReset = () => {
  for(const item in formItems) {
    formItems[item].value = ''
    formItems[item].isValid = false
  }
}

const formIsValid = computed(() => {
  for (const item of Object.values(formItems)) {
    if (!item.isValid) {
      return false
    }
  }
  return true
})
const formAllValues = computed(() => {
  const values = {}
  for (const item in formItems) {
    values[item] = formItems[item].value
  }
  return values
})

const setErrors = (errors) => {
  console.log('errors', errors)
  for (const item in formItems) {
    formItems[item].errors.splice(0, formItems[item].errors.length);
    if(errors[item]) formItems[item].errors.push(...errors[item])
  }
}

const submit = async () => {
  if(!formIsValid.value) {
    alert('Formulario no válido')
    return
  }
  try {
    await create(formAllValues.value)
    formReset()
    setErrors({})
    await getAll()
  } catch ({ message }) {
    setErrors(message)
  }
}

onMounted(() => {
  getAll()
})

</script>