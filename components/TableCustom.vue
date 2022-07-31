<template>
  <button @click="$emit('updateData')">Actualizar</button>
  <select @change="$emit('updatePerPage', $event.target.value)">
    <option selected></option>
    <option value="5">5</option>
    <option value="10">10</option>
    <option value="50">50</option>
    <option value="100">100</option>
  </select>
  <table>
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.field">
          {{ column.label }}
        </th>
      </tr>
    </thead>
    <tbody v-if="data">
      <tr v-for="row of data" :key="row.id">
        <td v-for="column in columns" :key="column.field">
          <div v-if="column.type === 'callback'">
            <slot
              name="callback"
              :data="row?.[column.field]"
              :field="column.field"
              :row="row"
            />
          </div>
          <div v-else>
            {{ row[column.field] }}
          </div>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th v-for="column in columns" :key="column.field">
          {{ column.label }}
        </th>
      </tr>
    </tfoot>
  </table>
  <Pagination :page="meta.page" :lastPage="meta.last_page" @update="$emit('updatePage' , $event)" />
</template>

<script setup>
import Pagination from '~/components/Pagination.vue'

const { data, columns, meta } = defineProps(['data', 'columns', 'meta'])
defineEmits(['updateData', 'updatePerPage', 'updatePage'])

</script>
