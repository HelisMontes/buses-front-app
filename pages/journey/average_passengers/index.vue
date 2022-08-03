<template>
  <h1>Promedio de pasajeros</h1>
  <br />
  <br />
  <TableCustom
    :data="list.data || []"
    :meta="list.meta || {}"
    :columns="COLUMNS"
    @update-data="getAll"
    @update-per-page="listUpdatePerPage"
    @update-page="listUpdatePage"
  />
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