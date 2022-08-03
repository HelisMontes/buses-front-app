<template>
  <h1>Buses porcentaje de tickets vendidos </h1>
  <br />
  <br />
  <TableCustom
    :data="busesAverageSoldList.data || []"
    :meta="busesAverageSoldList.meta || {}"
    :columns="COLUMNS"
    @update-data="busesAverageSoldGetAll"
    @update-per-page="busesAverageSoldListUpdatePerPage"
    @update-page="busesAverageSoldListUpdatePage"
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
  <Form
    name="busAveragePassengers"

    :structure="FORM_STRUCTURE"

    @submit="submit"

    ref="form"
  />
  <br/>
</template>

<script setup>
import { storeToRefs } from 'pinia'

import TableCustom from '~/components/TableCustom.vue'
import Form from '~/components/Form.vue'

import { useJourneyStore } from '@/stores/journey'

const journeyStore = useJourneyStore()
const { busesAverageSoldList, listAllToObject: journeyListAllToObject } = storeToRefs(journeyStore)
const {
  busesAverageSoldGetAll,
  busesAverageSoldUpdateParams,
  busesAverageSoldListUpdatePerPage,
  busesAverageSoldListUpdatePage,
  getListAll: journeyGetListAll,
} = journeyStore
const { COLUMNS } = journeyStore.busesAverageSoldList


await journeyGetListAll()

const FORM_STRUCTURE = {
  average_sold: {
    label: 'Cantidad promedio de tickets vendidos',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { min: 1, message: 'Mínimo 1' },
      { max: 10, message: 'Máximo 10' },
    ],
    value: '',
    errors: [],
    component: 'FormInputNumeric',
  },
  journey: {
    label: 'Origen',
    validations: [
      { required: true, message: 'Este campo es requerido' },
    ],
    options: journeyListAllToObject.value,
    value: '',
    errors: [],
    component: 'FormInputDatalist',
  },
}

const form = ref();
const submit = async (values) => {
  busesAverageSoldUpdateParams(values)
}

onMounted(() => {
})
</script>