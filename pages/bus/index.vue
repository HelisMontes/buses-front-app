<template>
  <h1>Bus page</h1>
  <br />
  <br />
  <TableCustom
    :data="list.data || []"
    :meta="list.meta || {}"
    :columns="COLUMNS"
    @update-data="getAll"
    @update-per-page="updatePerPage"
    @update-page="updatePage"
  >
    <template v-slot:callback="{ data, field }">
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
      <template v-else>
        {{ data }}
      </template>
    </template>
  </TableCustom>
  <!-- <Form>
    <FormItem label="Nombre">
      <Input v-model="form.name" />
    </FormItem>
    <FormItem label="Apellido">
      <Input v-model="form.lastname" />
    </FormItem>
    <FormItem label="Email">
      <Input v-model="form.email" />
    </FormItem>
    <FormItem label="Telefono">
      <Input v-model="form.phone" />
    </FormItem>
    <FormItem label="Direccion">
      <Input v-model="form.address" />
    </FormItem>
    <FormItem label="Estado">
      <Switch v-model="form.status" />
    </FormItem>
    <FormItem>
      <Button type="primary" @click="create">Crear</Button>
    </FormItem>
  </Form> -->
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useBusStore } from '@/stores/bus'

import TableCustom from '~/components/TableCustom.vue'
import Image from '~/components/Image.vue'

const busStore = useBusStore()
const { COLUMNS } = busStore
const { list } = storeToRefs(busStore)

const { getAll, updatePerPage, updatePage } = busStore

onMounted(() => {
  getAll()
})

</script>