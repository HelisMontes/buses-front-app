import prueba, { defineStore } from 'pinia'

console.log('----- counter.js -----')
console.log(prueba)

export const useCounterStore = defineStore({
    id: 'counter-store',
    state: () => ({ count: 0 }),
    getters: {
        double: (state) => state.count * 2,
    },
    actions: {
        increment() {
            this.count++
        },
    },
})
