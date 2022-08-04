<template>
  <div class="container__pages wrapper">
    <h1>Ticket page</h1>
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
            <template v-else-if="field === 'journey'">
              Origen - Destino: {{ data.origen.country }} - {{ data.origen.city }} / {{ data.destination.country }} - {{ data.destination.city }}
              <br/>
              Bus: {{ data.bus.plate }} - {{ data.bus.brand }} - {{ data.bus.model }} - {{ data.bus.color }}
              <br/>
              Chofer: {{ data.user.identification }} - {{ data.user.name }} - {{ data.user.last_name }} - {{ data.user.email }} - {{ data.user.phone }}
              <br/>
            </template>
            <template v-else-if="field === 'user'">
              {{ data.identification }} - {{ data.name }} {{ data.last_name }}
            </template>
            <template v-else>
              {{ data }}
            </template>
          </template>
        </TableCustom>
      </div>
      <div class="container__form">
        <Form
          name="ticket"

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

import TableCustom from '~/components/TableCustom.vue'
import Image from '~/components/Image.vue'
import Form from '~/components/Form.vue'

import { useTicketStore } from '@/stores/ticket'
import { useJourneyStore } from '@/stores/journey'
import { useUserStore } from '@/stores/user'
import alerts from '~/utils/alerts'

const alert = alerts()
const ticketStore = useTicketStore()
const { list, createStatus } = storeToRefs(ticketStore)
const { getAll, updatePerPage, updatePage, save } = ticketStore
const { COLUMNS } = ticketStore.list

const journeyStore = useJourneyStore()
const { listAllToObject: journeyListAllToObject } = storeToRefs(journeyStore)
const { getListAll: journeyGetListAll } = journeyStore

const userStore = useUserStore()
const { listAllToObject: userListAllToObject } = storeToRefs(userStore)
const { getListAll: userGetListAll } = userStore

try{
  await journeyGetListAll()
} catch (error) {
  console.log(error)
}
try{
  await userGetListAll({
    filter: {
      filter_by: 'type_user',
      filter_value: 'PASS',
    }
  })
} catch (error) {
  console.log(error)
}

const FORM_STRUCTURE = {
  user_id: {
    label: 'Usuario',
    validations: [
      { required: true, message: 'Este campo es requerido' },
    ],
    options: userListAllToObject.value,
    value: '',
    errors: [],
    component: 'FormInputDatalist',
  },
  journey_id: {
    label: 'Viaje',
    validations: [
      { required: true, message: 'Este campo es requerido' },
    ],
    options: journeyListAllToObject.value,
    value: '',
    errors: [],
    component: 'FormInputDatalist',
  },
  number_seat: {
    label: 'Número de asiento',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 1, message: 'Mínimo 1' },
      { max: 10, message: 'Máximo 10' },
    ],
    value: '',
    errors: [],
    component: 'FormInputNumeric',
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
      message?.ticket && alert.fire.error({
        text: message.ticket,
      })
    }
  }
}
const edit = async (row) => {
  form.value.setData(row)
}
const deleteItem = async (row) => {
  try {
    await ticketStore.delete({
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
      message?.ticket && alert.fire.error({
        text: message.ticket,
      })
    }
  }
}

onMounted(() => {
  getAll()
})

</script>