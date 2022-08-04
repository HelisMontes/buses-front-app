<template>
  <div class="container__pages wrapper">
    <h1>Bus</h1>
    <div class="row">
      <div class="container__table">
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
                alt="bus"
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
      </div>
      <div class="container__form">
        <Form
          name="bus"

          :structure="FORM_STRUCTURE"

          @submit="submit"

          ref="form"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useBusStore } from '@/stores/bus'

import TableCustom from '~/components/TableCustom.vue'
import Image from '~/components/Image.vue'
import Form from '~/components/Form.vue'

const busStore = useBusStore()
const { list, createStatus } = storeToRefs(busStore)
const { getAll, updatePerPage, updatePage, save } = busStore
const { COLUMNS } = busStore.list

const FORM_STRUCTURE = {
  brand: {
    label: 'Marca',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' }
    ],
    value: '',
    errors: [],
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
    component: 'FormInputNumeric',
  },
  image: {
    type: 'image',
    label: 'Imagen',
    validations: [
      { type: ['webp', 'jpeg', 'jpg', 'png'], message: 'El archivo debe ser una imagen (webp, jpeg, jpg, png)' },
    ],
    value: '',
    errors: [],
    component: 'FormInputFile',
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
      message?.bus && alert(message.bus)
    }
  }
}
const edit = async (row) => {
  form.value.setData(row)
}
const deleteItem = async (row) => {
  try {
    await busStore.delete({
      id: row.id,
    })
    form.value.reset(FORM_STRUCTURE)
    await getAll()
  } catch ({ message }) {
    if (typeof message === 'object' ) {
      form.value.setErrors(message)
    }else{
      message?.bus && alert(message.bus)
    }
  }
}

onMounted(() => {
  getAll()
})

</script>