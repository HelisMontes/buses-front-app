<template>
  <h1>Bus page</h1>
  <br />
  <br />
  <TableCustom
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
      <component :is="callComponent[item.component](item)" @update="($event) => { item.value = $event.value; item.isValid = $event.isValid}" />
    </template>
  </Form>
  {{ formItems }}
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
])

onMounted(() => {
  getAll()
})

</script>