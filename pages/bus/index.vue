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
  <Form>
    <template
      v-for="(item, index) in formItems"
      :key="index"
    >
      <br/>
      <br/>
      <component :is="callComponent[item.component](item)" @update="($event) => { item.value = $event.value; item.isValid = $event.isValid}" />
    </template>
  </Form>
  <br/>
  <br/>
  <br/>
  <pre>
    <code>
      {{ formItems }}
    </code>
  </pre>
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
const { list } = storeToRefs(busStore)

const { getAll, updatePerPage, updatePage } = busStore

const formItems = reactive([
  {
    label: 'Imagen',
    field: 'image',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { type: ['webp', 'jpeg', 'jpg', 'png'], message: 'El archivo debe ser una imagen (webp, jpeg, jpg, png)' },
    ],
    value: '',
    component: 'FormInputFile',
    isValid: true,
  },
  {
    label: 'Marca',
    field: 'brand',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' }
    ],
    value: '',
    component: 'FormInputText',
    isValid: true,
  },
  {
    label: 'Modelo',
    field: 'model',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' }
    ],
    value: '',
    component: 'FormInputText',
    isValid: true,
  },
  {
    label: 'Color',
    field: 'color',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' }
    ],
    value: '',
    component: 'FormInputText',
    isValid: true,
  },
  {
    label: 'Placa',
    field: 'plate',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' }
    ],
    value: '',
    component: 'FormInputText',
    isValid: true,
  },
  {
    label: 'Placa',
    field: 'plate',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' }
    ],
    value: '',
    component: 'FormInputText',
    isValid: true,
  },
  {
    label: 'Cantidad de asientos',
    field: 'quantity_seats',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 1, message: 'Mínimo 1' },
      { max: 10, message: 'Máximo 10' },
    ],
    value: '',
    component: 'FormInputNumeric',
    isValid: true,
  },
  {
    label: 'Año',
    field: 'year',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 1950, message: 'Mínimo 1950' },
      { max: 2050, message: 'Máximo 2050' },
    ],
    value: '',
    component: 'FormInputNumeric',
    isValid: true,
  },
])

onMounted(() => {
  getAll()
})

</script>