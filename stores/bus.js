import { defineStore } from 'pinia'


export const useBusStore = defineStore(
    'bus-store',
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

        function updatePerPage(per_page) {
            list.meta.per_page = per_page
            getAll()
        }
        function updatePage(page) {
            list.meta.page = page
            getAll()
        }

        return {
            list,
            getAll,
            updatePerPage,
            updatePage,
        }
    },
)
