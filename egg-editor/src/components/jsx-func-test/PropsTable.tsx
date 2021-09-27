import {defineComponent, PropType, computed, VNode} from 'vue'
import {TextComponentProps} from '../../defaultProps'
import {reduce} from 'lodash'
import {mapPropsToForms} from '../../propsMap'
import {Input, InputNumber, Slider, Radio, Select} from 'ant-design-vue'
import './style.css'

const mapToComponent = {
  'a-textarea': Input.TextArea,
  'a-input-number': InputNumber,
  'a-slider': Slider,
  'a-radio-group': Radio.Group,
  'a-radio-button': Radio.Button,
  'a-select': Select,
  'a-select-option': Select.Option,
} as any

interface FormProps {
  component: string;
  subComponent?: string;
  value: string;
  extraProps?: {[key: string]: any};
  text?: string;
  options?: {text: string | VNode; value: any}[];
  valueProp: string;
  eventName: string;
  events: {[key: string]: (e: any) => void};
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default defineComponent({
  name: 'props-table',
  props: {
    props: {
      type: Object as PropType<TextComponentProps>,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, context) {
    // console.log('props', props.props)

    const finalProps = computed(() => {
      return reduce(
        props.props,
        (result, value, key) => {
          // console.log('result, value, key', result, value, key)

          const newKey = key as keyof TextComponentProps
          const item = mapPropsToForms[newKey] // 预设 dom
          if (item) {
            const {
              valueProp = 'value',
              eventName = 'change',
              initalTransform,
              afterTransform,
            } = item
            const newItem: FormProps = {
              ...item,
              value: initalTransform ? initalTransform(value) : value,
              valueProp,
              eventName,
              events: {
                ['on' + capitalizeFirstLetter(eventName)]: (e: any) => {
                  context.emit('change', {
                    key,
                    value: afterTransform ? afterTransform(e) : e,
                  })
                },
              },
            }
            result[newKey] = newItem
          }
          return result
        },
        {} as {[key: string]: FormProps},
      )
    })

    // console.log('finalProps', finalProps)

    return () => (
      <div class="props-table">
        {Object.keys(finalProps.value).map((key) => {
          // console.log('prop:', finalProps.value[key])
          const value = finalProps.value[key] // {...key: value}
          const ComponentName = mapToComponent[value.component]
          const SubComponetName = value.subComponent
            ? mapToComponent[value.subComponent]
            : ''
          const props = {
            [value.valueProp]: value.value,
            ...value.extraProps,
            ...value.events
          }

          return (
            <div key={key} class="prop-item">
              {value.text && <span class="label">{value.text}</span>}
              <div class="prop-component">
                <ComponentName {...props}>
                  {value.options &&
                    value.options.map((option, index) => {
                      return (
                        <SubComponetName key={index} value={option.value}>
                          {option.text}
                        </SubComponetName>
                      )
                    })}
                </ComponentName>
              </div>
            </div>
          )
        })}
      </div>
    )
  },
})
