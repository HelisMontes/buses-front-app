import { defineStore, storeToRefs } from 'pinia'

import { useBusStore } from './bus'
import { useLocationStore } from './location'
import { useUserStore } from './user'


export const useJourneyStore = defineStore(
    'journey-store',
    () => {

        const busStore = useBusStore()
        const {
            getAll: busGetAll,
            updatePerPage: busUpdatePerPage,
            updatePage: busUpdatePage,
        } = busStore
        const {
            list: busList,
            listToObject: busListToObject,
        } = storeToRefs(busStore)

        const locationStore = useLocationStore()
        const {
            getAll: locationGetAll,
            updatePerPage: locationUpdatePerPage,
            updatePage: locationUpdatePage,
        } = locationStore
        const {
            list: locationList,
            listToObject: locationListToObject,
        } = storeToRefs(locationStore)

        const userStore = useUserStore()
        const {
            getAll: userGetAll,
            updatePerPage: userUpdatePerPage,
            updatePage: userUpdatePage,
        } = userStore
        const {
            list: userList,
            listToObject: userListToObject,
        } = storeToRefs(userStore)

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
            try{
                if(!busList?.value?.data?.length){
                    busUpdatePage(1)
                    busUpdatePerPage(10000)
                    await busGetAll()
                }
                if(!locationList?.value?.data?.length){
                    locationUpdatePage(1)
                    locationUpdatePerPage(10000)
                    await locationGetAll()
                }
                const listResult = await $fetch(`/api/journey/?${params}`, {
                    method: 'GET',
                })
                list.isLoading = false
                const { list: journeys, meta } = listResult.data.journeys
                console.log(journeys)
                for(let journey of journeys){
                    journey.bus_data = busListToObject.value[journey.bus]
                    journey.location_data = locationListToObject.value[journey.location]
                    journey.user_data = locationListToObject.value[journey.user]
                }
                list.data = journeys
                list.meta = meta
                return Promise.resolve(journeys)
            }catch({ data }){
                list.isLoading = false
                return Promise.reject(JSON.parse(data.message))
            }
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
            listToObject,
        }
    },
)
