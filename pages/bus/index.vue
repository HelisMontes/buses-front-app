<template>
  <h1>Bus page</h1>
  <button @click="$emit('increment')">Increment</button>
  <span>
    {{ counter }}
  </span>

</template>

<script setup>
import useCounterStore from '@/stores/counter.js'


const incrementStore = () => {
  const { state, dispatch } = useCounterStore()
  return {
    counter: state.counter,
    increment: () => dispatch('increment')
  }
}
// const useStore = () => {
//   const { state, actions } = useCounterStore()
//   return {
//     state,
//     actions
//   }
// }

onMounted(async () => {

  const resultPost = await $fetch('/api/bus/create',
    {
      method: 'post',
      body: {
        brand: 'mazda',
        color: 'rojo',
        model: '5',
        plate: 'a2',
        quantity_seats: '10',
        year: '2019',
      },
    },
  )
  console.log('resultPost', resultPost)

  // const resultPost = await $fetch(
  //   '/api/bus',
  //   {
  //     method: 'post',
  //     body: {
  //       brand: 'mazda',
  //       color: 'rojo',
  //       model: '5',
  //       plate: 'a1111',
  //       quantity_seats: '10',
  //       year: '2019',
  //     },
  //   },
  // )
  // console.log('resultPost', resultPost)
})

</script>