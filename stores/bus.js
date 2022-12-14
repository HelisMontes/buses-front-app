import { defineStore } from 'pinia'


const model = 'bus'

export const useBusStore = defineStore(
    `${model}-store`,
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
        const listAll = reactive({
            isLoading: false,
            data: [],
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
                    label: item.plate + ' ' + item.brand + ' ' + item.model,
                    description: item.color + ' ' + item.year,
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
            return $fetch(`/api/${model}/?${params}`, {
                method: 'GET',
            }).then(({ data, message }) => {
                list.isLoading = false
                const { list: buses, meta } = data.buses
                list.data = buses
                list.meta = meta
                return Promise.resolve(buses)
            }).catch(({ data }) => {
                list.isLoading = false
                return Promise.reject(JSON.parse(data?.message || '{}'))
            })
        }
        async function getListAll() {
            const params = new URLSearchParams({
                page: 'all',
                per_page: 'all',
            })
            return $fetch(`/api/${model}/?${params}`, {
                method: 'GET',
            }).then(({ data, message }) => {
                listAll.isLoading = false
                const { list: buses, meta } = data.buses
                listAll.data = buses
                listAll.meta = meta
                return Promise.resolve(buses)
            }).catch(({ data }) => {
                listAll.isLoading = false
                return Promise.reject(JSON.parse(data?.message || '{}'))
            })
        }
        const listAllToObject = computed(() => {
            const { data } = listAll
            const object = {}
            data.forEach(item => {
                object[item.id] = {
                    label: item.plate + ' ' + item.brand + ' ' + item.model,
                    description: item.color + ' ' + item.year,
                }
            })
            return object
        })
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
                return $fetch(`/api/${model}/update`, {
                    method: 'POST',
                    body: data,
                }).then(({ data, message }) => {
                    createStatus.isLoading = false
                    createStatus.data = data.bus
                    return data
                }).catch(({ data }) => {
                    createStatus.isLoading = false
                    return Promise.reject(JSON.parse(data?.message || '{}'))
                })
            }
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
                return Promise.reject(JSON.parse(data?.message || '{}'))
            })
        }

        async function deleteItem({ id }) {
            createStatus.isLoading = true
            createStatus.data = {}
            createStatus.errors = {}
            return $fetch(`/api/${model}/delete`, {
                method: 'POST',
                body: { id },
            }).then(({ data, message }) => {
                createStatus.isLoading = false
                createStatus.data = data.bus
                createStatus.errors = {}
                return data
            }).catch(({ data }) => {
                createStatus.isLoading = false
                return Promise.reject(JSON.parse(data?.message || '{}'))
            })
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

            listAll,
            getListAll,
            listAllToObject,
        }
    },
)
