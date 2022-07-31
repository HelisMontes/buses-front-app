import { defineStore } from 'pinia'


export const useBusStore = defineStore(
    'bus-store',
    () => {
        const COLUMNS = [
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
                label: 'Imagen',
                field: 'image',
                type: 'callback',
            },
            {
                label: 'Estado',
                field: 'status',
                type: 'callback',
            },
        ]

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
        })

        const createStatus = reactive({
            isLoading: false,
            data: {},
            errors: {},
        })

        // const listAltered = computed(() => {
        //     const { data } = list
        //     return data.map(item => {
        //         return {
        //             ...item,
        //             text: item.text + ' (altered)',
        //         }
        //     })
        // })

        async function getAll() {
            const params = new URLSearchParams({
                page: list.meta.page,
                per_page: list.meta.per_page,
            })
            list.isLoading = true
            list.data = []
            return $fetch(`/api/bus/?${params}`, {
                method: 'GET',
            }).then(({ data, message }) => {
                list.isLoading = false
                const { list: buses, meta } = data.buses
                list.data = buses
                list.meta = meta
                return message || ''
            }).catch(error => {
                list.isLoading = false
                console.log(error)
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

        async function create(data) {
            createStatus.isLoading = true
            createStatus.data = {}
            createStatus.errors = {}
            return $fetch('/api/bus/create', {
                method: 'POST',
                body: data,
            }).then(({ data, message }) => {
                createStatus.isLoading = false
                createStatus.data = data.bus
                createStatus.errors = {}
                return message || ''
            }).catch(({ data }) => {
                createStatus.isLoading = false
                return Promise.reject(JSON.parse(data.message))
            })
        }

        return {
            COLUMNS,
            list,
            getAll,
            updatePerPage,
            updatePage,
            create,
            createStatus,
        }
    },
)
