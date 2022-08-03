<template>
  <h1>Journey page</h1>
  <br />
  <Form
    name="journey-available-for-sale"

    :structure="FORM_STRUCTURE"

    @submit="submit"
    submit-text="Buscar"

    ref="form"
  />
  <br/>
  <br />
  <TableCustom
    :data="availableForSaleList.data || []"
    :meta="availableForSaleList.meta || {}"
    :columns="COLUMNS"
    @update-data="getAll"
    @update-per-page="availableForSaleListUpdatePerPage"
    @update-page="availableForSaleListUpdatePage"
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
          text="Comprar"
          @click="toBuy(row)"
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
</template>

<script setup>
import { storeToRefs } from 'pinia'

import TableCustom from '~/components/TableCustom.vue'
import Image from '~/components/Image.vue'
import Form from '~/components/Form.vue'

import { useJourneyStore } from '@/stores/journey'
import { useLocationStore } from '@/stores/location'

const journeyStore = useJourneyStore()
const { availableForSaleList } = storeToRefs(journeyStore)
const {
  availableForSaleGetAll,
  availableForSaleListUpdatePerPage,
  availableForSaleListUpdatePage,
  availableForSaleUpdateParams,
} = journeyStore
const { COLUMNS } = journeyStore.availableForSaleList

const locationStore = useLocationStore()
const { listAllToObject: locationListAllToObject } = storeToRefs(locationStore)
const { getListAll: locationGetListAll } = locationStore

await locationGetListAll()

const router = useRouter()

const route = useRoute()
const {
  page,
  perPage,
  start,
  end,
  origen,
  destination,
} = route.query

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
  start: {
    label: 'Fecha y hora de inicio',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      { minDate: 'now', message: 'La fecha debe ser mayor a la actual' },
    ],
    value: '',
    errors: [],
    component: 'FormInputDatetime',
  },
  end: {
    label: 'Fecha y hora de fin',
    validations: [
      { required: true, message: 'Este campo es requerido' },
      {
        moreThanField: 'start',
        message: 'La fecha debe ser mayor a la de inicio',
      },
    ],
    value: '',
    errors: [],
    component: 'FormInputDatetime',
  },
}

const form = ref();
const submit = async (values) => {
  availableForSaleUpdateParams(values)
  availableForSaleGetAll()
}
const toBuy = async (row) => {
  router.push({
    path: `buy/${row.id}`,
  })
}

onMounted(() => {
  if (start && end && origen && destination) {
    console.log('set params')
    availableForSaleUpdateParams({
      start,
      end,
      origen_id: origen,
      destination_id: destination,
    })
    if (page && perPage) {
      availableForSaleListUpdatePerPage(perPage)
      availableForSaleListUpdatePage(page)
    }
    availableForSaleGetAll()
  }
})
</script>