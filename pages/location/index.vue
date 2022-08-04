<template>
  <div class="container__pages wrapper">
    <h1>Location</h1>
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
                alt="location"
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
          name="location"
    
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
import { useLocationStore } from '@/stores/location'

import TableCustom from '~/components/TableCustom.vue'
import Image from '~/components/Image.vue'
import Form from '~/components/Form.vue'
import alerts from '~/utils/alerts'

const alert = alerts()
const locationStore = useLocationStore()
const { list, createStatus } = storeToRefs(locationStore)
const { getAll, updatePerPage, updatePage, save } = locationStore
const { COLUMNS } = locationStore.list

const FORM_STRUCTURE = {
  country: {
    label: 'País',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' },
    ],
    value: '',
    errors: [],
    component: 'FormInputText',
  },
  city: {
    label: 'Ciudad',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' },
    ],
    value: '',
    errors: [],
    component: 'FormInputText',
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
    alert.fire.success({
      text: 'Guardado correctamente',
    })
    await getAll()
  } catch ({ message }) {
    if (typeof message === 'object' ) {
      form.value.setErrors(message)
    }else{
      message?.location && alert.fire.error({
        text: message.location,
      })
    }
  }
}
const edit = async (row) => {
  form.value.setData(row)
}
const deleteItem = async (row) => {
  try {
    await locationStore.delete({
      id: row.id,
    })
    form.value.reset(FORM_STRUCTURE)
    alert.fire.success({
      text: 'Eliminado correctamente',
    })
    await getAll()
  } catch ({ message }) {
    if (typeof message === 'object' ) {
      form.value.setErrors(message)
    }else{
      message?.location && alert.fire.error({
        text: message.location,
      })
    }
  }
}

onMounted(() => {
  getAll()
})

</script>