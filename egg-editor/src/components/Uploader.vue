<template>
  <div class="file-upload">
    <div class="upload-area" @click="triggerUpload">
      <slot v-if="isUploading" name="loading">
        <button disabled>正在上传</button>
      </slot>
      <!-- custom loaded -->
      <slot
        v-else-if="lastFileData && lastFileData.loaded"
        name="uploaded"
        :uploadedData="lastFileData.data"
      >
        <button>点击上传</button>
      </slot>
      <slot v-else name="default">
        <button>点击上传</button>
      </slot>
    </div>

    <input
      ref="fileInput"
      type="file"
      :multiple="multiple"
      :accept="accept"
      :style="{display: 'none'}"
      @change="handleFileChange"
    />
    <ul class="upload-list">
      <li
        :class="`uploaded-file upload-${file.status}`"
        v-for="file in uploadedFiles"
        :key="file.uid"
      >
        <span v-if="file.status === 'loading'" class="file-icon"
          ><LoadingOutlined />{{ file.percent || 0 }} %</span
        >
        <span v-else class="file-icon"
          ><FileOutlined />{{ file.percent }} %</span
        >
        <span class="filename">{{ file.name }}</span>
        <button class="delete-icon" @click="removeFile(file)">
          <DeleteOutlined />
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, reactive, ref} from 'vue'
import axios from 'axios'
import {v4 as uuidv4} from 'uuid'
import {last} from 'lodash-es'
import {
  DeleteOutlined,
  LoadingOutlined,
  FileOutlined,
} from '@ant-design/icons-vue'

type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckUpload = (file: File) => boolean | Promise<File>

export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status: UploadStatus;
  raw: File;
  resp?: any;
  percent?: number;
}

export default defineComponent({
  components: {
    DeleteOutlined,
    LoadingOutlined,
    FileOutlined,
  },
  props: {
    action: {
      type: String,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: '',
    },
    headers: {
      type: Object,
      default: () => ({}),
    },
    beforeUpload: {
      type: Function as PropType<CheckUpload>,
    },
    onProgress: {
      type: Function as PropType<(percent: number, file: UploadFile) => void>,
    },
    onSuccess: {
      type: Function as PropType<(resp: any, file: UploadFile) => void>,
    },
    onError: {
      type: Function as PropType<(err: any, file: UploadFile) => void>,
    },
    onRemove: {
      type: Function as PropType<(file: UploadFile) => void>,
    },
    onChange: {
      type: Function as PropType<(file: UploadFile) => void>,
    },
    name: {
      type: String,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const uploadedFiles = ref<UploadFile[]>([])
    const isUploading = computed(() => {
      return uploadedFiles.value.some((file) => file.status === 'loading')
    })

    const CancelToken = axios.CancelToken
    let cancel: (message?: string) => void

    const lastFileData = computed(() => {
      const lastFile = last(uploadedFiles.value)
      if (lastFile) {
        return {
          loaded: lastFile.status === 'success',
          data: lastFile.resp,
        }
      }
      return false
    })

    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }

    const removeFile = (file: UploadFile) => {
      uploadedFiles.value = uploadedFiles.value.filter(
        (item) => item.uid !== file.uid,
      )

      if (props.onRemove) {
        props.onRemove(file)
      }

      if (props.onChange) {
        props.onChange(file)
      }
    }

    // update file list
    const updateFileList = (
      file: UploadFile,
      percentObj: Partial<UploadFile>,
    ) => {
      uploadedFiles.value.forEach((item) => {
        if (item.uid === file.uid) {
          Object.assign(item, percentObj)
          return item
        }
        return item
      })
    }

    const postFile = (uploadedFile: File) => {
      const fileObj = reactive<UploadFile>({
        uid: uuidv4(),
        size: uploadedFile.size,
        name: uploadedFile.name,
        status: 'loading',
        raw: uploadedFile,
        percent: 0,
      })
      uploadedFiles.value.push(fileObj)

      const formData = new FormData()
      formData.append(props.name || uploadedFile.name || 'file', uploadedFile)

      if (props.data) {
        Object.keys(props.data).forEach((key) => {
          formData.append(key, props.data[key])
        })
      }

      // 发送 axios 请求
      axios
        .post(props.action, formData, {
          headers: {
            ...props.headers,
            'Content-Type': 'multipart/form-data',
          },
          cancelToken: new CancelToken(function executor(c) {
            // executor 函数接收一个 cancel 函数作为参数
            cancel = c
          }),
          onUploadProgress: (e: ProgressEvent) => {
            const shouldUploading = uploadedFiles.value.find(
              (f) => f.uid === fileObj.uid,
            )
            if (shouldUploading) {
              const percentage = Math.round((e.loaded * 100) / e.total) || 0
              if (percentage < 100) {
                updateFileList(fileObj, {
                  percent: percentage,
                  status: 'loading',
                })
                props.onProgress && props.onProgress(percentage, fileObj)
              }
            } else {
              cancel()
            }
          },
        })
        .then((resp) => {
          console.log('resp.data', resp.data)
          // 联动 fileStatus -> change status -> success
          // fileObj.status = 'success'
          // fileObj.resp = resp.data
          updateFileList(fileObj, {
            percent: 100,
            status: 'success',
            resp: resp.data,
          })

          if (props.onSuccess) {
            props.onSuccess(resp.data, fileObj)
          }

          if (props.onChange) {
            props.onChange(fileObj)
          }
        })
        .catch((error) => {
          // console.log(error)
          // 联动 fileStatus -> change status -> error
          fileObj.status = 'error'
          if (props.onError) {
            props.onError(error, fileObj)
          }

          if (props.onChange) {
            props.onChange(fileObj)
          }
        })
        .finally(() => {
          if (fileInput.value) {
            fileInput.value.value = ''
          }
        })
    }

    // axios 请求
    const handleFileChange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          if (props.beforeUpload) {
            const result = props.beforeUpload(file)
            if (result && result instanceof Promise) {
              result
                .then((processedFile) => {
                  if (processedFile instanceof File) {
                    postFile(processedFile)
                  } else {
                    throw new Error(
                      'beforeUpload Promise should return File Object',
                    )
                  }
                })
                .catch((e) => {
                  console.error(e)
                })
            } else if (result) {
              postFile(file)
            }
          } else {
            postFile(file)
          }
        }
      }
    }

    return {
      fileInput,
      triggerUpload,
      isUploading,
      handleFileChange,
      uploadedFiles,
      removeFile,
      lastFileData,
    }
  },
})
</script>
<style lang="scss">
.upload-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.upload-list li {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  font-size: 14px;
  line-height: 1.8;
  margin-top: 5px;
  box-sizing: border-box;
  border-radius: 4px;
  min-width: 200px;
  position: relative;
  &:first-child {
    margin-top: 10px;
  }
  .file-icon {
    svg {
      margin-right: 5px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .filename {
    margin-left: 5px;
    margin-right: 40px;
  }
  &.upload-error {
    color: #f5222d;
    svg {
      color: #f5222d;
    }
  }
  .file-status {
    display: block;
    position: absolute;
    right: 5px;
    top: 0;
    line-height: inherit;
  }
  .delete-icon {
    display: none;
    position: absolute;
    right: 7px;
    top: 0;
    line-height: inherit;
    cursor: pointer;
    border: none;
    background-color: transparent;
  }
  &:hover {
    background-color: #efefef;
    .file-status {
      display: none;
    }
    .delete-icon {
      display: block;
    }
  }
}
</style>
