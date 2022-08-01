import { defineStore } from 'pinia'


export const useUserStore = defineStore(
    'user-store',
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
                    label: 'identification',
                    field: 'identification',
                },
                {
                    label: 'name',
                    field: 'name',
                },
                {
                    label: 'last_name',
                    field: 'last_name',
                },
                {
                    label: 'email',
                    field: 'email',
                },
                {
                    label: 'phone',
                    field: 'phone',
                },
                {
                    label: 'birth_date',
                    field: 'birth_date',
                },
                {
                    label: 'type_user',
                    field: 'type_user',
                    type: 'callback',
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
            return $fetch(`/api/user/?${params}`, {
                method: 'GET',
            }).then(({ data, message }) => {
                list.isLoading = false
                const { list: users, meta } = data.users
                list.data = users
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

        async function save(data) {
            createStatus.isLoading = true
            createStatus.data = {}
            createStatus.errors = {}
            if(data.id) {
                return $fetch(`/api/user/update`, {
                    method: 'POST',
                    body: data,
                }).then(({ data, message }) => {
                    createStatus.isLoading = false
                    createStatus.data = data.user
                    return message || ''
                }).catch(error => {
                    createStatus.isLoading = false
                    console.log(error)
                })
            }
            return $fetch('/api/user/create', {
                method: 'POST',
                body: data,
            }).then(({ data, message }) => {
                createStatus.isLoading = false
                createStatus.data = data.user
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
            return $fetch('/api/user/delete', {
                method: 'POST',
                body: { id },
            }).then(({ data, message }) => {
                createStatus.isLoading = false
                createStatus.data = data.user
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