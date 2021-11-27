<template>
  <div class="homepage-caontaner">
    <uploader
      action="http://localhost:3087/users"
      multiple="true"
      withCookie="true"
      :beforeUpload="beforeUploadFunc"
      :onProgress="onProgressFunc"
      :onSuccess="onSuccessFunc"
      :onError="onErrorFunc"
      :onRemove="onRemoveFunc"
      :onChange="onChangeFunc"
      :accept="accept"
      :headers="headers"
      :data="fileData"
      :name="fileName"
    ></uploader>
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
import {useStore} from 'vuex'
import UserProfile from '../components/UserProfile.vue'
import {GlobalDataProps} from '../store/index'
import Uploader, {UploadFile} from '../components/Uploader.vue'
export default defineComponent({
  name: 'Index',
  components: {
    UserProfile,
    Uploader,
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const user = computed(() => store.state.user)

    // upload -----------------------------------------------------------------------
    const accept = '.jpg, .png, .xml, .xlsx, .pdf'
    const headers = {
      cain: 'back',
      yep: 'something',
    }

    // dev -> Uploader component -> before upload Function
    const beforeUploadFunc = (file: File) => {
      console.log('life cycle -> before upoload', file)
      if (file instanceof File) {
        return true
      }
      return false
    }

    const onProgressFunc = (
      percent: number,
      file: object,
      fileList: UploadFile[],
    ) => {
      console.log('life cycle -> on progress', percent, file, fileList)
      return Promise.resolve()
    }

    const onSuccessFunc = (
      response: object,
      file: object,
      fileList: UploadFile[],
    ) => {
      console.log('life cycle -> on success', response, file, fileList)
      return Promise.resolve()
    }

    const onErrorFunc = (err: object, file: object, fileList: UploadFile[]) => {
      console.log('life cycle -> on error', err, file, fileList)
      return Promise.resolve()
    }

    const onRemoveFunc = (file: object, fileList: UploadFile[]) => {
      console.log('life cycle -> on remove', file, fileList)
      return Promise.resolve()
    }

    const onChangeFunc = (file: object, fileList: UploadFile[]) => {
      console.log('life cycle -> on change', file, fileList)
      return Promise.resolve()
    }

    const fileData = {
      name: 'egg.png',
      message: `data test ${Math.random()}`,
    }

    const fileName = 'Test File Name'

    // -----------------------------------------------------------------------------

    return {
      UserProfile,
      Uploader,
      user,
      // Uploader component -> life cycle
      beforeUploadFunc,
      onProgressFunc,
      onSuccessFunc,
      onErrorFunc,
      onRemoveFunc,
      onChangeFunc,
      accept,
      headers,
      fileData,
      fileName,
    }
  },
})
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  color: #fff;
}
</style>
