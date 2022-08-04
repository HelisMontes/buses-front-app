<template>
  <div class="container__pages wrapper">
    <h1>User</h1>
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
                alt="user"
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
            <template v-else-if="field === 'type_user'">
              {{ TYPE_USER[data] || '-' }}
            </template>
            <template v-else>
              {{ data }}
            </template>
          </template>
        </TableCustom>
      </div>
      <div class="container__form">
        <Form
          name="user"

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
import { useUserStore } from '@/stores/user'

import TableCustom from '~/components/TableCustom.vue'
import Image from '~/components/Image.vue'
import Form from '~/components/Form.vue'

const userStore = useUserStore()
const { list, createStatus } = storeToRefs(userStore)
const { getAll, updatePerPage, updatePage, save } = userStore
const { COLUMNS } = userStore.list

const TYPE_USER = {
  'DRIV': 'Chofer',
  'PASS': 'Pasajero',
}

const FORM_STRUCTURE = {
  identification: {
    label: 'Documento',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 20, message: 'Máximo 20 caracteres' },
      { match: /^[0-9]+$/, message: 'Sólo números' },
    ],
    value: '',
    errors: [],
    component: 'FormInputText',
  },
  name: {
    label: 'Nombre',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 50, message: 'Máximo 20 caracteres' }
    ],
    value: '',
    errors: [],
    component: 'FormInputText',
  },
  last_name: {
    label: 'Apellido',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 50, message: 'Máximo 20 caracteres' }
    ],
    value: '',
    errors: [],
    component: 'FormInputText',
  },
  email: {
    label: 'Correo electrónico',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 100, message: 'Máximo 20 caracteres' },
      { email: true, message: 'Email inválido' },
    ],
    value: '',
    errors: [],
    component: 'FormInputText',
  },
  phone: {
    label: 'Teléfono',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 3, message: 'Mínimo 3 caracteres' },
      { max: 15, message: 'Máximo 20 caracteres' },
      { match: /^[0-9]+$/, message: 'Sólo números' },
    ],
    value: '',
    errors: [],
    component: 'FormInputText',
  },
  birth_date: {
    label: 'Fecha de nacimiento',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { minDate: '1900-01-01', message: 'Mínimo 1900-01-01' },
      { maxDate: 'today', message: 'La fecha máxima es hoy' },
    ],
    value: '',
    errors: [],
    component: 'FormInputDate',
  },
  type_user: {
    label: 'Tipo de usuario',
    validations: [
      { required: true, message: 'Este campo es requerido' },
    ],
    options: {
      DRIV: {
        label: 'Conductor',
      },
      PASS: {
        label: 'Pasajero',
      },
    },
    value: '',
    errors: [],
    component: 'FormInputDatalist',
  },
  image: {
    type: 'image',
    label: 'Foto de perfil',
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
      message?.user && alert(message.user)
    }
  }
}
const edit = async (row) => {
  form.value.setData(row)
}
const deleteItem = async (row) => {
  try {
    await userStore.delete({
      id: row.id,
    })
    form.value.reset(FORM_STRUCTURE)
    await getAll()
  } catch ({ message }) {
    if (typeof message === 'object' ) {
      form.value.setErrors(message)
    }else{
      message?.user && alert(message.user)
    }
  }
}

onMounted(() => {
  getAll()
})

</script>