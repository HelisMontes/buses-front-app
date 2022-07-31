import { defineStore } from 'pinia'


export const useFormConfigStore = defineStore(
    'form-config-store',
    () => {
        const createStatus = reactive({
            bus: {
                isValidated: false,
                structure: {}
            },
        })

        async function setForm(key, structure) {
            createStatus[key].structure = structure
        }

        return {
        }
    },
)
