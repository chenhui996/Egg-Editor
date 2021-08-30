import {createStore} from 'vuex'

export interface UserProps {
  isLogin: boolean;
  userName?: string;
}

export interface TemplateProps {
  id: number;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
}

export interface GlobalDataProps {
  user: UserProps;
  templates: TemplateProps[];
}

const testData: TemplateProps[] = [
  {
    id: 1,
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-889755.png',
    title: '前端架构师直播海报',
    author: 'cain',
    copiedCount: 1,
  },
  {
    id: 2,
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-677311.png',
    title: '前端架构师直播海报',
    author: 'cain',
    copiedCount: 1,
  },
  {
    id: 3,
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-682056.png',
    title: '前端架构师直播海报',
    author: 'cain',
    copiedCount: 1,
  },
  {
    id: 4,
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-677311.png',
    title: '前端架构师直播海报',
    author: 'cain',
    copiedCount: 1,
  },
  {
    id: 5,
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-889755.png',
    title: '前端架构师直播海报',
    author: 'cain',
    copiedCount: 1,
  },
  {
    id: 6,
    coverImg:
      'https://static.imooc-lego.com/upload-files/screenshot-677311.png',
    title: '前端架构师直播海报',
    author: 'cain',
    copiedCount: 1,
  },
]

// 创建 store
const store = createStore<GlobalDataProps>({
  state: {
    templates: testData,
    user: {isLogin: false},
  },
  mutations: {
    login(state) {
      state.user = {...state.user, isLogin: true, userName: 'cain'}
    },
    logout(state) {
      state.user = {isLogin: false}
    },
  },
  getters: {
      getTemplateById: (state) => (id: number) => {
          return state.templates.find(t => t.id === id)
      }
  }
})

export default store
