<template>
  <div class="file-upload">
    <button @click="triggerUpload">
      <span v-if="fileStatus === 'loading'">正在上传</span>
      <span v-else-if="fileStatus === 'success'">上传成功</span>
      <span v-else-if="fileStatus === 'error'">上传失败</span>
      <span v-else>点击上传</span>
    </button>
    <input
      ref="fileInput"
      type="file"
      :style="{display: 'none'}"
      @change="handleFileChange"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import axios from 'axios'

type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<UploadStatus>('ready')
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }

    // axios 请求
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files // 类数组
      if (files) {
        const uploadedFile = files[0]
        const formData = new FormData() // 默认文件实例
        // 将内容塞进去
        formData.append(uploadedFile.name, uploadedFile)
        // 联动 fileStatus -> change status -> loading
        fileStatus.value = 'loading'
        // 发送 axios 请求
        axios
          .post(props.action, formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // 设置 axios 请求头，告诉后端 -> 咱发送的是文件
            },
          })
          .then((resp) => {
            // console.log('resp.data', resp.data)
            // 联动 fileStatus -> change status -> success
            fileStatus.value = 'success'
          })
          .catch((error) => {
            console.log(error)
            // 联动 fileStatus -> change status -> error
            fileStatus.value = 'error'
          })
      }
    }

    // 常见的
    return {fileInput, triggerUpload, fileStatus, handleFileChange}
  },
})
</script>
