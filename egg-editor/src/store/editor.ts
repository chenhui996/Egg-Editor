import {Module} from 'vuex'
import {v4 as uuidv4} from 'uuid'
import {GlobalDataProps} from './index'
import {TextComponentProps} from '../defaultProps'

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[];
  // 当前编辑的是哪个元素，uuid
  currentElement: string;
  // 当然最后保存的时候还是有一些项目信息，这里并没有写出，等做到的时候再补充
}

export interface ComponentData {
  // 这个元素的属性，属性请详见下面
  props: Partial<TextComponentProps>;
  // id, uuid v4 生成
  id: string;
  // 业务组件库的名称 e-test, e-image 等等
  name: string;
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'e-text',
    props: {
      text: 'hello',
      fontSize: '20px',
      color: '#000000',
      lineHeight: '1',
      textAlign: 'left',
      fontFamily: '',
    },
  },
  {
    id: uuidv4(),
    name: 'e-text',
    props: {
      text: 'hello2',
      fontSize: '10px',
      fontWeight: 'bold',
      lineHeight: '2',
      textAlign: 'center',
      fontFamily: '',
    },
  },
  {
    id: uuidv4(),
    name: 'e-text',
    props: {
      text: 'hello3',
      fontSize: '15px',
      actionType: 'url',
      url: 'http://www.baidu.com',
      lineHeight: '3',
      textAlign: 'right',
      fontFamily: '',
    },
  },
]

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
  },
  mutations: {
    addComponent(state, props: Partial<TextComponentProps>) {
      const newComponent: ComponentData = {
        id: uuidv4(),
        name: 'e-text',
        props,
      }
      // console.log('props', props)

      state.components.push(newComponent)
    },

    setActive(state, currentId: string) {
      state.currentElement = currentId
    },

    onDelete(state, currentId: string) {
      // console.log('state.components', state.components)
      const newComponents = state.components.filter(
        (component) => component.id !== currentId,
      )
      state.components = newComponents
    },

    updateComponent(state, {key, value}) {
      const updateComponent = state.components.find(
        (component) => component.id === state.currentElement,
      )

      if (updateComponent) {
        updateComponent.props[key as keyof TextComponentProps] = value
      }
    },
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find(
        (component) => component.id === state.currentElement,
      )
    },
  },
}

export default editor
