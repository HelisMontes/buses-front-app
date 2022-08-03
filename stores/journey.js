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
                return Promise.reject(JSON.parse(data.message))
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
        }
    },
)
