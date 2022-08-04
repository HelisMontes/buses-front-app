<template>
  <div class="container__pages wrapper">
    <h1>Disponibles para la venta</h1>
    <div class="row__report">
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
      </div>
      <div class="container__form">
        <Form
          name="journey-available-for-sale"
    
          :structure="FORM_STRUCTURE"
    
          @submit="submit"
          submit-text="Buscar"
    
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
import { useLocationStore } from '@/stores/location'

const journeyStore = useJourneyStore()
const { availableForSaleList: list } = storeToRefs(journeyStore)
const {
  availableForSaleGetAll: getAll,
  availableForSaleListUpdatePerPage: updatePerPage,
  availableForSaleListUpdatePage: updatePage,
  availableForSaleUpdateParams: updateParams,
} = journeyStore
const { COLUMNS } = journeyStore.availableForSaleList

const locationStore = useLocationStore()
const { listAllToObject: locationListAllToObject } = storeToRefs(locationStore)
const { getListAll: locationGetListAll } = locationStore

try{
  await locationGetListAll()
} catch (error) {
  console.log(error)
}

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
  updateParams(values)
  getAll()
}
const toBuy = async (row) => {
  router.push({
    path: `buy/${row.id}`,
  })
}

onMounted(() => {
  if (start && end && origen && destination) {
    updateParams({
      start,
      end,
      origen_id: origen,
      destination_id: destination,
    })
    if (page && perPage) {
      updatePerPage(perPage)
      updatePage(page)
    }
    getAll()
  }
})
</script>