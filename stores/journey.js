import { defineStore, storeToRefs } from 'pinia'


export const useJourneyStore = defineStore(
    'journey-store',
    () => {
        const list = reactive({
            isLoading: false,
            data: [],
            meta: {
                page: 0,
                per_page: 10,
                total_items: 10,
                prev_page: null,
                next_page: null,
                last_page: 1,
            },
            COLUMNS: [
                {
                    label: 'N°',
                    field: 'id',
                },
                {
                    label: 'Origen',
                    field: 'origen',
                    type: 'callback',
                },
                {
                    label: 'Destino',
                    field: 'destination',
                    type: 'callback',
                },
                {
                    label: 'Bus',
                    field: 'bus',
                    type: 'callback',
                },
                {
                    label: 'Usuario',
                    field: 'user',
                    type: 'callback',
                },
                {
                    label: 'Precio',
                    field: 'price',
                },
                {
                    label: 'Fecha de salida',
                    field: 'datetime_start',
                },
                {
                    label: 'Fecha de llegada',
                    field: 'datetime_end',
                },
                {
                    label: 'Estado',
                    field: 'status',
                    type: 'callback',
                },
                {
                    label: 'Acciones',
                    field: 'actions',
                    type: 'callback',
                },
            ]
        })

        const createStatus = reactive({
            isLoading: false,
            data: {},
            errors: {},
        })

        const listToObject = computed(() => {
            const { data } = list
            const object = {}
            data.forEach(item => {
                object[item.id] = {
                    label: item.origen + ' ' + item.destination + ' ' + item.bus + ' ' + item.user,
                    description: item.price + ' ' + item.datetime_start + ' ' + item.datetime_end,
                }
            })
            return object
        })

        async function getAll() {
            const params = new URLSearchParams({
                page: list.meta.page,
                per_page: list.meta.per_page,
            })
            list.isLoading = true
            list.data = []
            return $fetch(`/api/journey/?${params}`, {
                method: 'GET',
            }).then(({ data, message }) => {
                list.isLoading = false
                const { list: journeys, meta } = data.journeys
                list.data = journeys
                list.meta = meta
                return journeys
            }).catch(({ data }) => {
                list.isLoading = false
                return Promise.reject({})
            })
        }
        async function updatePerPage(per_page) {
            list.meta.per_page = per_page
            return getAll()
        }
        async function updatePage(page) {
            list.meta.page = page
            return getAll()
        }

        async function save(data) {
            createStatus.isLoading = true
            createStatus.data = {}
            createStatus.errors = {}
            if(data.id) {
                return $fetch(`/api/journey/update`, {
                    method: 'POST',
                    body: data,
                }).then(({ data, message }) => {
                    createStatus.isLoading = false
                    createStatus.data = data.journey
                    return message || ''
                }).catch(({ data }) => {
                    createStatus.isLoading = false
                    return Promise.reject(JSON.parse(data.message))
                })
            }
            return $fetch('/api/journey/create', {
                method: 'POST',
                body: data,
            }).then(({ data, message }) => {
                createStatus.isLoading = false
                createStatus.data = data.journey
                createStatus.errors = {}
                return message || ''
            }).catch(({ data }) => {
                createStatus.isLoading = false
                return Promise.reject(JSON.parse(data.message))
            })
        }

        async function deleteItem({ id }) {
            createStatus.isLoading = true
            createStatus.data = {}
            createStatus.errors = {}
            return $fetch('/api/journey/delete', {
                method: 'POST',
                body: { id },
            }).then(({ data, message }) => {
                createStatus.isLoading = false
                createStatus.data = data.journey
                createStatus.errors = {}
                return message || ''
            }).catch(({ data }) => {
                createStatus.isLoading = false
                return Promise.reject(JSON.parse(data.message))
            })
        }

        const availableForSaleList = reactive({
            isLoading: false,
            data: [],
            meta: {
                page: 0,
                per_page: 10,
                total_items: 10,
                prev_page: null,
                next_page: null,
                last_page: 1,
            },
            COLUMNS: [
                {
                    label: 'N°',
                    field: 'id',
                },
                {
                    label: 'Bus',
                    field: 'bus',
                    type: 'callback',
                },
                {
                    label: 'Usuario',
                    field: 'user',
                    type: 'callback',
                },
                {
                    label: 'Precio',
                    field: 'price',
                },
                {
                    label: 'Fecha de salida',
                    field: 'datetime_start',
                },
                {
                    label: 'Fecha de llegada',
                    field: 'datetime_end',
                },
                {
                    label: 'Acciones',
                    field: 'actions',
                    type: 'callback',
                },
            ]
        })
        async function availableForSaleGetAll() {
            const params = new URLSearchParams({
                ...availableForSaleList.meta,
            })
            availableForSaleList.isLoading = true
            availableForSaleList.data = []
            return $fetch(`/api/journey/available-for-sale?${params}`, {
                method: 'GET',
            }).then(({ data, message }) => {
                availableForSaleList.isLoading = false
                const { list: journeys, meta } = data.journeys
                availableForSaleList.data = journeys
                availableForSaleList.meta = meta
                return journeys
            }).catch(({ data }) => {
                availableForSaleList.isLoading = false
                return Promise.reject(JSON.parse(data.message))
            })
        }
        async function availableForSaleUpdateParams(paramsNews) {
            availableForSaleList.meta = {
                ...availableForSaleList.meta,
                ...paramsNews,
            }
            return availableForSaleGetAll()
        }
        async function availableForSaleListUpdatePerPage(per_page) {
            availableForSaleList.meta.per_page = per_page
            return availableForSaleGetAll()
        }
        async function availableForSaleListUpdatePage(page) {
            availableForSaleList.meta.page = page
            return availableForSaleGetAll()
        }

        const stateToBuy = reactive({
            isLoading: true,
            data: {
                id: null,
                tickets: [],
                journey: {},
            },
            errors: {},
        })
        async function getToBuy({ id }) {
            stateToBuy.isLoading = true
            stateToBuy.data = {
                id,
                tickets: [],
                journey: {},
            }
            return $fetch(`/api/journey/to_buy/${id}`, {
                method: 'GET',
            }).then(({ data, message }) => {
                stateToBuy.isLoading = false
                const { journey, tickets } = data
                stateToBuy.data.journey = journey
                stateToBuy.data.tickets = tickets
                return stateToBuy.data
            }).catch(({ data }) => {
                stateToBuy.isLoading = false
                return Promise.reject(data)
            })
        }

        async function ticketCreate({ number_seat, user_id }) {
            const body = {
                number_seat,
                user_id,
                journey_id: stateToBuy.data.id,
            }
            return $fetch(`/api/ticket/create`, {
                method: 'POST',
                body,
            }).then(({ data, message }) => {
                stateToBuy.isLoading = false
                return data.ticket
            }).catch(({ data }) => {
                stateToBuy.isLoading = false
                return Promise.reject(data)
            })
        }

        const busesAverageSoldList = reactive({
            isLoading: false,
            data: [],
            meta: {
                page: 0,
                per_page: 10,
                total_items: 10,
                prev_page: null,
                next_page: null,
                last_page: 1,
                average_sold: 0,
            },
            COLUMNS: [
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
                    label: 'Año',
                    field: 'year',
                },
                {
                    label: 'Imagen',
                    field: 'image',
                    type: 'callback',
                },
                {
                    label: 'Estado',
                    field: 'status',
                    type: 'callback',
                },
                {
                    label: 'Acciones',
                    field: 'actions',
                    type: 'callback',
                },
            ]
        })
        async function busesAverageSoldGetAll() {
            const params = new URLSearchParams({
                ...busesAverageSoldList.meta,
            })
            busesAverageSoldList.isLoading = true
            busesAverageSoldList.data = []
            return $fetch(`/api/journey/buses_average_sold?${params}`, {
                method: 'GET',
            }).then(({ data, message }) => {
                busesAverageSoldList.isLoading = false
                const { list: journeys, meta } = data.journeys
                busesAverageSoldList.data = journeys
                busesAverageSoldList.meta = meta
                return journeys
            }).catch(({ data }) => {
                busesAverageSoldList.isLoading = false
                return Promise.reject(data)
            })
        }
        async function busesAverageSoldUpdateParams(paramsNews) {
            busesAverageSoldList.meta = {
                ...busesAverageSoldList.meta,
                ...paramsNews,
            }
            return busesAverageSoldGetAll()
        }
        async function busesAverageSoldListUpdatePerPage(per_page) {
            busesAverageSoldList.meta.per_page = per_page
            return busesAverageSoldGetAll()
        }
        async function busesAverageSoldListUpdatePage(page) {
            busesAverageSoldList.meta.page = page
            return busesAverageSoldGetAll()
        }

        const listAll = reactive({
            isLoading: false,
            data: [],
        })
        async function getListAll() {
            const params = new URLSearchParams({
                page: 'all',
                per_page: 'all',
            })
            return $fetch(`/api/journey/?${params}`, {
                method: 'GET',
            }).then(({ data, message }) => {
                listAll.isLoading = false
                const { list: journeys, meta } = data.journeys
                listAll.data = journeys
                listAll.meta = meta
                return Promise.resolve(journeys)
            }).catch(({ data }) => {
                listAll.isLoading = false
                return Promise.reject(JSON.parse(data.message))
            })
        }
        const listAllToObject = computed(() => {
            const { data } = listAll
            const object = {}
            data.forEach(item => {
                object[item.id] = {
                    label: item.origen.country + '-' + item.origen.city + ' ' + item.destination.country + '-' + item.destination.city,
                    description: item.bus.plate + ' ' + item.bus.brand + ' ' + item.bus.model + ' / ' + item.user.identification + ' ' + item.user.name + ' ' + item.user.last_name,
                }
            })
            return object
        })

        const averagePassengersList = reactive({
            isLoading: false,
            data: [],
            meta: {
                page: 0,
                per_page: 10,
                total_items: 10,
                prev_page: null,
                next_page: null,
                last_page: 1,
                average_sold: 0,
            },
            COLUMNS: [
                {
                    label: 'Promedio de tiempo de viaje (en segundos)',
                    field: 'range',
                },
                {
                    label: 'Viaje',
                    field: 'name',
                },
                {
                    label: 'Promedio de pasajeros %',
                    field: 'passengers_average',
                },
            ]
        })
        async function averagePassengersGetAll() {
            const params = new URLSearchParams({
                ...averagePassengersList.meta,
            })
            averagePassengersList.isLoading = true
            averagePassengersList.data = []
            return $fetch(`/api/journey/average_passengers?${params}`, {
                method: 'GET',
            }).then(({ data, message }) => {
                averagePassengersList.isLoading = false
                const { list: journeys, meta } = data.journeys
                averagePassengersList.data = journeys
                averagePassengersList.meta = meta
                return journeys
            }).catch(({ data }) => {
                averagePassengersList.isLoading = false
                return Promise.reject(data)
            })
        }
        async function averagePassengersListUpdatePerPage(per_page) {
            averagePassengersList.meta.per_page = per_page
            return averagePassengersGetAll()
        }
        async function averagePassengersListUpdatePage(page) {
            averagePassengersList.meta.page = page
            return averagePassengersGetAll()
        }

        return {
            list,
            getAll,
            updatePerPage,
            updatePage,
            save,
            delete: deleteItem,
            createStatus,
            listToObject,

            availableForSaleList,
            availableForSaleGetAll,
            availableForSaleUpdateParams,
            availableForSaleListUpdatePerPage,
            availableForSaleListUpdatePage,

            stateToBuy,
            getToBuy,

            ticketCreate,

            busesAverageSoldList,
            busesAverageSoldGetAll,
            busesAverageSoldUpdateParams,
            busesAverageSoldListUpdatePerPage,
            busesAverageSoldListUpdatePage,

            listAll,
            listAllToObject,
            getListAll,

            averagePassengersList,
            averagePassengersGetAll,
            averagePassengersListUpdatePerPage,
            averagePassengersListUpdatePage,
        }
    },
)
