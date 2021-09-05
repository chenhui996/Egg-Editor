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

interface ComponentData {
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
      color: 'red',
    },
  },
  {
    id: uuidv4(),
    name: 'e-text',
    props: {
      text: 'hello2',
      fontSize: '10px',
      fontWeight: 'bold',
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
      state.components.push(newComponent)
    },
  },
}

export default editor
