<template>
  <div class="container__pages wrapper">
    <h1>Journey page</h1>
    <div class="journey__buy">
      <h2>
        Journey id: {{ stateToBuy.data.id }}
      </h2>
    </div>
      <div class="container__form">
        <Form
          name="toBuy"
    
          :structure="FORM_STRUCTURE"
    
          @submit="submit"
          submit-text="Comprar"
    
          ref="form"
        />
      </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'

import TableCustom from '~/components/TableCustom.vue'
import Image from '~/components/Image.vue'

import { useJourneyStore } from '@/stores/journey'
import { useUserStore } from '@/stores/user'

const journeyStore = useJourneyStore()
const { stateToBuy } = storeToRefs(journeyStore)
const { getToBuy, ticketCreate } = journeyStore

const userStore = useUserStore()
const { listAllToObject: userListAllToObject } = storeToRefs(userStore)
const { getListAll: userGetListAll } = userStore

const {
  id,
} = useRoute().params

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
try{
  await getToBuy({ id })
} catch (error) {
  console.log(error)
}

const FORM_STRUCTURE = {
  number_seat: {
    label: 'Asientos',
    validations: [
      { required: true, message: 'Este campo es requerido' },
    ],
    options: stateToBuy.value.data.tickets,
    value: '',
    errors: [],
    component: 'FormSeatList',
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
}

const form = ref();
const submit = async (values) => {
  try {
    await ticketCreate(values)
    alert('Compra realizada exitosamente')
    window.location.reload()
  } catch ({ message }) {
    if (typeof message === 'object' ) {
      form.value.setErrors(message)
    }else{
      message?.journey && alert(message.journey)
    }
  }
}

onMounted(() => {
})
</script>