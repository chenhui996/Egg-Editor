import store from '@/store/index' // vuex store
import {testData} from '@/store/templates' // list page
import {testComponents, ComponentData} from '@/store/editor' // components template and type
import {TextComponentProps} from '@/defaultProps' // type -> e-text
import {last, clone} from 'lodash-es'

const cloneComponent = clone(testComponents)

describe('test vuex store', () => {
  it('should have three modules', () => {
    expect(store.state).toHaveProperty('user')
    expect(store.state).toHaveProperty('templates')
    expect(store.state).toHaveProperty('editor')
  })
  describe('test user module', () => {
    it('test login mutation', () => {
      store.commit('login')
      expect(store.state.user.isLogin).toBeTruthy()
    })
    it('test logout mutation', () => {
      store.commit('logout')
      expect(store.state.user.isLogin).toBeFalsy()
    })
  })
  describe('test templates module', () => {
    it('should have default templates', () => {
      expect(store.state.templates.data).toHaveLength(testData.length)
    })
    it('should get the correct template by Id', () => {
      const selectTemplate = store.getters.getTemplateById(1)
      expect(selectTemplate.title).toBe('test item 1')
    })
  })
  describe('test editor module', () => {
    it('should have default components', () => {
      expect(store.state.editor.components).toHaveLength(cloneComponent.length)
    })
    it('should get current component when set active one component', () => {
      store.commit('setActive', cloneComponent[0].id)
      expect(store.state.editor.currentElement).toBe(cloneComponent[0].id)
      const currentElement: ComponentData = store.getters.getCurrentElement
      expect(currentElement.id).toBe(cloneComponent[0].id)
    })
    it('add component should works fine', () => {
      const payload: Partial<TextComponentProps> = {
        text: 'something alse',
      }
      store.commit('addComponent', payload)
      expect(store.state.editor.components).toHaveLength(
        cloneComponent.length + 1,
      )
      const lastItem = last(store.state.editor.components)
      expect(lastItem?.props.text).toBe('something alse')
    })
    it('update component should works fine', () => {
      const newProps = {
        key: 'text',
        value: 'update value',
      }
      store.commit('updateComponent', newProps)
      const currentElement: ComponentData = store.getters.getCurrentElement
      expect(currentElement.props.text).toBe('update value')
    })
  })
})
