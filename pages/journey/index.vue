<template>
  <h1>Journey page</h1>
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
    <template v-slot:callback="{ data, field, row }">
      <template v-if="field === 'status'">
        <span v-if="data">Activo</span>
        <span v-else>Inactivo</span>
      </template>
      <template v-else-if="field === 'image'">
        <Image
          :src="data"
          alt="journey"
        />
      </template>
      <template v-else-if="field === 'actions'">
        <Button
          text="Editar"
          @click="edit(row)"
        />
        <Button
          text="Eliminar"
          @click="deleteItem(row)"
        />
      </template>
      <template v-else>
        {{ data }}
      </template>
    </template>
  </TableCustom>
  <Form
    name="journey"

    :structure="FORM_STRUCTURE"

    @submit="submit"

    ref="form"
  />
  <br/>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useJourneyStore } from '@/stores/journey'

import TableCustom from '~/components/TableCustom.vue'
import Image from '~/components/Image.vue'
import Form from '~/components/Form.vue'

const journeyStore = useJourneyStore()
const { list, createStatus } = storeToRefs(journeyStore)
const { getAll, updatePerPage, updatePage, save } = journeyStore
const { COLUMNS } = journeyStore.list

const FORM_STRUCTURE = {
  origen: {
    label: 'Origen',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' },
    ],
    value: '',
    errors: [],
    component: 'FormInputText',
  },
  destination: {
    label: 'Destino',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' },
    ],
    value: '',
    errors: [],
    component: 'FormInputText',
  },
  bus: {
    label: 'Bus',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' },
    ],
    value: '',
    errors: [],
    component: 'FormInputText',
  },
  user: {
    label: 'Usuario',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' },
    ],
    value: '',
    errors: [],
    component: 'FormInputText',
  },
  price: {
    label: 'Precio',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 1, message: 'Mínimo 1' },
      { max: 1000000000, message: 'Máximo 1000000000' },
    ],
    value: '',
    errors: [],
    component: 'FormInputNumeric',
  },
  datetime_start: {
    label: 'Fecha y hora de inicio',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { minDate: 'now', message: 'La fecha debe ser mayor a la actual' },
    ],
    value: '',
    errors: [],
    component: 'FormInputDatetime',
  },
  datetime_end: {
    label: 'Fecha y hora de fin',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      {
        moreThanField: 'datetime_start',
        message: 'La fecha debe ser mayor a la de inicio',
      },
    ],
    value: '',
    errors: [],
    component: 'FormInputDatetime',
  },
  status: {
    label: 'Estado',
    validations: [
      { required: true, message: 'Este campo es requerido' },
    ],
    value: undefined,
    errors: [],
    component: 'FormInputCheckbox',
  },
}

const form = ref();
const submit = async (values) => {
  try {
    await save(values)
    form.value.reset(FORM_STRUCTURE)
    await getAll()
  } catch ({ message }) {
    if (typeof message === 'object' ) {
      form.value.setErrors(message)
    }else{
      message?.journey && alert(message.journey)
    }
  }
}
const edit = async (row) => {
  form.value.setData(row)
}
const deleteItem = async (row) => {
  try {
    await journeyStore.delete({
      id: row.id,
    })
    form.value.reset(FORM_STRUCTURE)
    await getAll()
  } catch ({ message }) {
    if (typeof message === 'object' ) {
      form.value.setErrors(message)
    }else{
      message?.journey && alert(message.journey)
    }
  }
}

onMounted(() => {
  getAll()
})

</script>