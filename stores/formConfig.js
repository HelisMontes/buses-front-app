import { defineStore } from 'pinia'


export const useFormConfigStore = defineStore(
    'form-config-store',
    () => {
        const forms = reactive({})

        function setForm(key, { structure }) {
            let structureCloned = { ...structure }
            try {
                structureCloned = structuredClone(structure)
            }catch(e){
                structureCloned = Object.assign({}, structure)
            }
            if(!forms[key]) {
                forms[key] = {}
            }
            forms[key].isValidated = false
            forms[key].structure = structureCloned
        }

        function setValue(key, field, value) {
            if(!forms[key]) return
            forms[key].structure[field].value = value
        }

        function setFormValidated(key, isValidated) {
            if(!forms[key]) return
            forms[key].isValidated = isValidated
        }

        function setErrors(key, field, errors) {
            if(!forms[key]) return
            forms[key].structure[field].errors = errors
        }

        function getValues(key) {
            if(!forms[key]) return
            const values = {}
            const structure = forms[key].structure
            for (const item in structure) {
                if (structure[item]?.value !== undefined && structure[item]?.value !== '') {
                    values[item] = structure[item].value
                }
            }
            return values
        }

        function setErrorsList(key, errors) {
            if(!forms[key]) return
            console.log('setErrorsList', key, errors)
            const structure = forms[key].structure
            console.log('structure', structure)
            for (const item in structure) {
                if (forms[key].structure[item].errors) {
                    forms[key].structure[item].errors.splice(0, forms[key].structure[item].errors.length);
                    if(errors[item]) forms[key].structure[item].errors.push(...errors[item])
                    delete errors[item]
                }
            }
            if (Object.keys(errors).length > 0) {
                setErrorsGeneral(key, errors)
            }
        }

        function setErrorsGeneral(key, errors) {
            if(!forms[key]) return
            forms[key].errors = []
            for (const item in errors) {
                forms[key].errors.push(...errors[item])
            }
        }

        function setData(key, { data }) {
            if(!forms[key]) return
            for (const item in data) {
                if(item === 'id'){
                    forms[key].structure[item] = {}
                    forms[key].structure[item]['value'] = data[item]
                }else if(forms[key].structure[item]) {
                    forms[key].structure[item].errors = []
                    if(forms[key].structure[item].component !== 'FormInputFile') {
                        forms[key].structure[item].value = data[item]
                    }else{
                        forms[key].structure[item].value = ''
                        forms[key].structure[item].fileOld = data[item]
                    }
                }
            }
        }

        return {
            forms,
            setForm,
            setData,
            setValue,
            setFormValidated,
            setErrors,
            setErrorsList,
            setErrorsGeneral,
            getValues,
        }
    },
)
