<template>
  <ul>
    <NuxtLink v-slot="{ navigate }" :to="item" custom v-for="item in items" :key="item.text">
      <li @click="navigate">
        {{ item.text }}
      </li>
    </NuxtLink>
  </ul>
</template>

<script setup>
const router = useRouter()
const route = useRoute()

console.log('route', route)
console.log('router', router)

const items = [
  {
    text: 'Inicio',
    path: '/',
  },
  {
    text: 'Bus',
    path: '/bus',
  },
  {
    text: 'Ubicación',
    path: '/location',
  },
  {
    text: 'Usuario',
    path: '/user',
  },
  {
    text: 'Viaje',
    path: '/journey',
  },
  {
    text: 'Viaje - Promedio de pasajeros',
    path: '/journey/average_passengers',
  },
  {
    text: 'Viaje - disponibles para la venta',
    path: '/journey/available-for-sale',
  },
  {
    text: 'Bus - Promedio de ventas',
    path: '/journey/buses_average_sold',
  },
  {
    text: 'Ticket',
    path: '/ticket',
  },
  {
    text: 'Contáctame',
    path: '/contact',
  },
]

const goTo = ({ path }) => {
  router.push({
    name: 'bus',
  })
}

</script>
