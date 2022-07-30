import FormInputText from '~/components/FormInputText.vue'


export default {
  'FormInputText': (props) => {
    delete props.component
    return h(FormInputText, props, 'dsf')
  },
}