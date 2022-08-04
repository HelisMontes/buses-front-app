<template>
  <div class="container__pages wrapper">
    <h1>Journey</h1>
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
            <template v-else-if="field === 'origen'">
              {{ data.country }} - {{ data.city }}
            </template>
            <template v-else-if="field === 'destination'">
              {{ data.country }} - {{ data.city }}
            </template>
            <template v-else-if="field === 'bus'">
              {{ data.plate }} - {{ data.brand }} - {{ data.model }}
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
          name="journey"

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

import { useJourneyStore } from '@/stores/journey'
import { useBusStore } from '@/stores/bus'
import { useLocationStore } from '@/stores/location'
import { useUserStore } from '@/stores/user'
import alerts from '~/utils/alerts'

const alert = alerts()
const journeyStore = useJourneyStore()
const { list, createStatus } = storeToRefs(journeyStore)
const { getAll, updatePerPage, updatePage, save } = journeyStore
const { COLUMNS } = journeyStore.list

const busStore = useBusStore()
const { listAllToObject: busListAllToObject } = storeToRefs(busStore)
const { getListAll: busGetListAll } = busStore

const locationStore = useLocationStore()
const { listAllToObject: locationListAllToObject } = storeToRefs(locationStore)
const { getListAll: locationGetListAll } = locationStore

const userStore = useUserStore()
const { listAllToObject: userListAllToObject } = storeToRefs(userStore)
const { getListAll: userGetListAll } = userStore

try {
  await busGetListAll()
} catch (error) {
  console.log(error)  
}
try{
  await locationGetListAll()
} catch (error) {
  console.log(error)
}
try {
  await userGetListAll({
    filter: {
      filter_by: 'type_user',
      filter_value: 'DRIV',
    }
  })
} catch (error) {
  console.log(error)
}

const FORM_STRUCTURE = {
  origen_id: {
    label: 'Origen',
    validations: [
      { required: true, message: 'Este campo es requerido' },
    ],
    options: locationListAllToObject.value,
    value: '',
    errors: [],
    component: 'FormInputDatalist',
  },
  destination_id: {
    label: 'Destino',
    validations: [
      { required: true, message: 'Este campo es requerido' },
    ],
    options: locationListAllToObject.value,
    value: '',
    errors: [],
    component: 'FormInputDatalist',
  },
  bus_id: {
    label: 'Bus',
    validations: [
      { required: true, message: 'Este campo es requerido' },
    ],
    options: busListAllToObject.value,
    value: '',
    errors: [],
    component: 'FormInputDatalist',
  },
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
    alert.fire.success({
      text: 'Guardado correctamente',
    })
    await getAll()
  } catch ({ message }) {
    if (typeof message === 'object' ) {
      form.value.setErrors(message)
    }else{
      message?.journey && alert.fire.error({
        text: message.journey,
      })
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
    alert.fire.success({
      text: 'Eliminado correctamente',
    })
    await getAll()
  } catch ({ message }) {
    if (typeof message === 'object' ) {
      form.value.setErrors(message)
    }else{
      message?.journey && alert.fire.error({
        text: message.journey,
      })
    }
  }
}

onMounted(() => {
  getAll()
})

</script>