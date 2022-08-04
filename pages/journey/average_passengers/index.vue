<template>
  <div class="container__pages wrapper">
    <h1>Promedio de pasajeros</h1>
    <TableCustom
      :data="list.data || []"
      :meta="list.meta || {}"
      :columns="COLUMNS"
      @update-data="getAll"
      @update-per-page="listUpdatePerPage"
      @update-page="listUpdatePage"
    >
      <template v-slot:callback="{ data, field }">
        <template v-if="field === 'range'">
          {{ data ? (data / 60 / 60) : '-' }}
        </template>
        <template v-else>
          {{ data }}
        </template>
      </template>
    </TableCustom>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'

import TableCustom from '~/components/TableCustom.vue'

import { useJourneyStore } from '@/stores/journey'

const journeyStore = useJourneyStore()
const { averagePassengersList: list } = storeToRefs(journeyStore)
const {
  averagePassengersGetAll: getAll,
  averagePassengersListUpdatePerPage: listUpdatePerPage,
  averagePassengersListUpdatePage: listUpdatePage,
} = journeyStore
const { COLUMNS } = journeyStore.averagePassengersList

onMounted(() => {
  getAll()
})
</script>