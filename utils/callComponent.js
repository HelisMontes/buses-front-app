import FormInputText from '~/components/FormInputText.vue'
import FormInputNumeric from '~/components/FormInputNumeric.vue'
import FormInputFile from '~/components/FormInputFile.vue'
import FormInputCheckbox from '~/components/FormInputCheckbox.vue'
import FormInputDate from '~/components/FormInputDate.vue'
import FormInputDatalist from '~/components/FormInputDatalist.vue'
import FormInputDatetime from '~/components/FormInputDatetime.vue'


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
  },
  'FormInputDatalist': (props) => {
    delete props.component
    return h(FormInputDatalist, props, '')
  },
  'FormInputDatetime': (props) => {
    delete props.component
    return h(FormInputDatetime, props, '')
  }
}