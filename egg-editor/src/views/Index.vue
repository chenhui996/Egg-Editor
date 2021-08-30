<template>
  <div class="homepage-caontaner">
    <a-layout :style="{background: '#fff'}">
      <!-- header -->
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">Egg-H5</router-link>
        </div>
        <user-profile :user="user"></user-profile>
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
import {computed, defineComponent} from 'vue'
import { useStore } from 'vuex'
import UserProfile from '../components/UserProfile.vue'
import { GlobalDataProps } from '../store/index'
export default defineComponent({
  name: 'Index',
  components: {
    UserProfile
  },
  setup (){
    const store= useStore<GlobalDataProps>()
    const user = computed(() => store.state.user)

    return {
      UserProfile,
      user
    }
  }
})
</script>

<style>
.page-title {
  color: #fff;
}
</style>
