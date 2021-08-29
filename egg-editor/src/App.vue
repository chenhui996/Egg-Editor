<template>
  <div class="homepage-caontaner">
    <a-layout :style="{background: '#fff'}">
      <a-layout-header class="header">
        <div class="page-title">慕课乐高</div>
      </a-layout-header>
      <a-layout-content class="home-layout">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer
        >© EGG（egg.chenhui.com）版权所有 | 沪ICP备xxxxxxxx号-x
      </a-layout-footer>
    </a-layout>
  </div>
  <template-detail></template-detail>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
// import Home from './views/Home.vue'
// import Editor from './views/Editor.vue'
// import TemplateDetail from './views/TemplateDetail.vue'
export default defineComponent({
  name: 'App',
  components: {
    // Home,
  },
})
</script>
