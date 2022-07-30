import FormInputText from '~/components/FormInputText.vue'
import FormInputNumeric from '~/components/FormInputNumeric.vue'


export default {
  'FormInputText': (props) => {
    delete props.component
    return h(FormInputText, props, '')
  },
  'FormInputNumeric': (props) => {
    delete props.component
    return h(FormInputNumeric, props, '')
  },
}