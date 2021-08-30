<template>
  <div class="homepage-caontaner">
    <a-layout :style="{background: '#fff'}">
      <!-- header -->
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">Egg-H5</router-link>
        </div>
      </a-layout-header>
      <!-- content -->
      <a-layout-content class="home-layout">
        <router-view></router-view>
      </a-layout-content>
      <!-- footer -->
      <a-layout-footer
        >© EGG（egg.chenhui.com）版权所有 | 沪ICP备xxxxxxxx号-x
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
export default defineComponent({
  name: 'Index',
})
</script>

<style>
.page-title {
  color: #fff;
}
</style>
