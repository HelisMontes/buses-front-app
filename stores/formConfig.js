import { defineStore } from 'pinia'


export const useFormConfigStore = defineStore(
    'form-config-store',
    () => {
        const forms = reactive({})

        function setForm(key, { structure }) {
            console.log('setForm', key, structure)
            if(!forms[key]) {
                forms[key] = {}
            }
            forms[key].isValidated = false
            forms[key].structure = structuredClone(structure)
        }

        function setValue(key, field, value) {
            console.log('setValue', key, field, value)
            if(!forms[key]) return
            forms[key].structure[field].value = value
        }

        function setFormValidated(key, isValidated) {
            console.log('setFormValidated', key, isValidated)
            if(!forms[key]) return
            forms[key].isValidated = isValidated
        }

        function setErrors(key, field, errors) {
            console.log('setErrors', key, field, errors)
            if(!forms[key]) return
            forms[key].structure[field].errors = errors
        }

        function getValues(key) {
            console.log('getValues', key)
            if(!forms[key]) return
            const values = {}
            const structure = forms[key].structure
            for (const item in structure) {
                console.log('item', item)
                values[item] = structure[item].value
            }
            return values
        }

        function setErrorsList(key, errors) {
            console.log('setErrorsList', key, errors)
            if(!forms[key]) return
            const structure = forms[key].structure
            for (const item in structure) {
                forms[key].structure[item].errors.splice(0, forms[key].structure[item].errors.length);
                if(errors[item]) forms[key].structure[item].errors.push(...errors[item])
            }
        }

        return {
            forms,
            setForm,
            setValue,
            setFormValidated,
            setErrors,
            setErrorsList,
            getValues,
        }
    },
)
