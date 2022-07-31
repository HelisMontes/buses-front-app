import FormInputText from '~/components/FormInputText.vue'
import FormInputNumeric from '~/components/FormInputNumeric.vue'
import FormInputFile from '~/components/FormInputFile.vue'
import FormInputCheckbox from '~/components/FormInputCheckbox.vue'
import FormInputDate from '~/components/FormInputDate.vue'


export default {
  'FormInputText': (props) => {
    delete props.component
    return h(FormInputText, props, '')
  },
  'FormInputNumeric': (props) => {
    delete props.component
    return h(FormInputNumeric, props, '')
  },
  'FormInputFile': (props) => {
    delete props.component
    return h(FormInputFile, props, '')
  },
  'FormInputCheckbox': (props) => {
    delete props.component
    return h(FormInputCheckbox, props, '')
  },
  'FormInputDate': (props) => {
    delete props.component
    return h(FormInputDate, props, '')
  }
}