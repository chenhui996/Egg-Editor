<template>
  <div class="editor-container">
    <a-layout>
      <a-layout-sider width="300" style="background: #fff">
        <div class="sidebar-container">
          组件列表<components-list
            :list="defaultTextTemplates"
            @onItemClick="addItem"
          ></components-list>
        </div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <div class="preview-list" id="canvas-area">
            <edit-wrapper
              v-for="component in components"
              :key="component.id"
              :id="component.id"
              @setActive="setActive"
              :active="component.id === (currentElement && currentElement.id)"
            >
              <component v-bind="component.props" :is="component.name" />
            </edit-wrapper>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider
        width="300"
        style="background: #fff"
        class="settings-panel"
      >
        组件属性
        <pre>{{ currentElement && currentElement.props }}</pre>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue'
import {useStore} from 'vuex'
import {GlobalDataProps} from '../store'
import EText from '../components/EText.vue'
import componentsList from '../components/ComponentsList.vue'
import EditWrapper from '../components/EditWrapper.vue'
import {defaultTextTemplates} from '../defaultTemplates'
import {ComponentData} from '../store/editor'
import ComponentsList from '../components/ComponentsList.vue'
import {TextComponentProps} from '../defaultProps'

export default defineComponent({
  components: {
    EText,
    ComponentsList,
    EditWrapper,
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const components = computed(() => store.state.editor.components)
    const currentElement = computed<ComponentData | null>(
      () => store.getters.getCurrentElement,
    )
    const addItem = (props: TextComponentProps) => {
      store.commit('addComponent', props)
    }
    const setActive = (id: string) => {
      store.commit('setActive', id)
    }
    return {
      components,
      defaultTextTemplates,
      componentsList,
      addItem,
      setActive,
      currentElement,
    }
  },
})
</script>

<style>
.editor-container .preview-container {
  padding: 24px;
  margin: 0;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.editor-container .preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}
</style>
