import { defineStore } from 'pinia'


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
                    label: 'origen',
                    field: 'origen',
                    type: 'callback',
                },
                {
                    label: 'destination',
                    field: 'destination',
                    type: 'callback',
                },
                {
                    label: 'bus',
                    field: 'bus',
                    type: 'callback',
                },
                {
                    label: 'user',
                    field: 'user',
                    type: 'callback',
                },
                {
                    label: 'price',
                    field: 'price',
                },
                {
                    label: 'datetime_start',
                    field: 'datetime_start',
                },
                {
                    label: 'datetime_end',
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
            return $fetch(`/api/journey/?${params}`, {
                method: 'GET',
            }).then(({ data, message }) => {
                list.isLoading = false
                const { list: journeys, meta } = data.journeys
                list.data = journeys
                list.meta = meta
                return message || ''
            }).catch(({ data }) => {
                createStatus.isLoading = false
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
