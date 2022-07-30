<template>
  <h1>Bus page</h1>
  <br />
  <br />
  <TableCustom :data="list.data || []" :meta="list.meta || {}" @update-data="getAll" @update-per-page="updatePerPage" @update-page="updatePage" :columns="[
    {
      label: 'N°',
      field: 'id',
    },
    {
      label: 'Placa',
      field: 'plate',
    },
    {
      label: 'Color',
      field: 'color',
    },
    {
      label: 'Marca',
      field: 'brand',
    },
    {
      label: 'Modelo',
      field: 'model',
    },
    {
      label: 'Serial',
      field: 'serial',
    },
    {
      label: 'Año',
      field: 'year',
    },
    {
      label: 'Activo',
      field: 'status',
      type: 'callback',
    },
    {
      label: 'Creado en',
      field: 'created_at',
    },
    {
      label: 'Actualizado en',
      field: 'updated_at',
    },
  ]">
    <template v-slot:callback="{ dataRow }">
      {{ dataRow.status ? 'Si' : 'No' }}
    </template>
  </TableCustom>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useBusStore } from '@/stores/bus'

import TableCustom from '~/components/TableCustom.vue'

const busStore = useBusStore()
const { list } = storeToRefs(busStore)

const { getAll, updatePerPage, updatePage } = busStore

onMounted(async () => {
  getAll()
})

</script>