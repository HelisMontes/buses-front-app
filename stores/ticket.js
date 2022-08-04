import { defineStore } from 'pinia'


const model = 'ticket'

export const useTicketStore = defineStore(
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
                    label: 'Usuario',
                    field: 'user',
                    type: 'callback',
                },
                {
                    label: 'Viaje',
                    field: 'journey',
                    type: 'callback',
                },
                {
                    label: 'Número de asiento',
                    field: 'number_seat',
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
                const { list: tickets, meta } = data.tickets
                list.data = tickets
                list.meta = meta
                return tickets
            }).catch(({ data }) => {
                list.isLoading = false
                return Promise.reject(JSON.parse(data?.message || '{}'))
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
                return $fetch(`/api/${model}/update`, {
                    method: 'POST',
                    body: data,
                }).then(({ data, message }) => {
                    createStatus.isLoading = false
                    createStatus.data = data.ticket
                    return message || ''
                }).catch(({ data }) => {
                    createStatus.isLoading = false
                    return Promise.reject(JSON.parse(data?.message || '{}'))
                })
            }
            return $fetch(`/api/${model}/create`, {
                method: 'POST',
                body: data,
            }).then(({ data, message }) => {
                createStatus.isLoading = false
                createStatus.data = data.ticket
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
                createStatus.data = data.journey
                createStatus.errors = {}
                return message || ''
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
        }
    },
)
