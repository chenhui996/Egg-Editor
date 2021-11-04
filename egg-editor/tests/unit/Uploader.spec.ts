import {mount, shallowMount, VueWrapper} from '@vue/test-utils'
import Uploader from '@/components/Uploader.vue'
import axios from 'axios'
import flushPromises from 'flush-promises'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
let wrapper: VueWrapper<any>
const testFile = new File(['xyz'], 'test.png', {type: 'image/png'})

const mockComponent = {
  template: '<div><slot></slot></div>',
}

const mockComponents = {
  DeleteOutlined: mockComponent,
  LoadingOutlined: mockComponent,
  FileOutlined: mockComponent,
}

const setInputValue = (input: HTMLInputElement) => {
  const files = [testFile] as any
  // 通过 Object.defineProperty 来模拟 input.files 属性
  Object.defineProperty(input, 'files', {
    value: files,
    writable: false,
  })
}

describe('Uploader Component', () => {
  beforeAll(() => {
    wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
      },
      global: {
        stubs: mockComponents,
      },
    })
  })
  it('basic layout before uploading', () => {
    expect(wrapper.find('button').exists()).toBeTruthy()
    expect(wrapper.get('button').text()).toBe('点击上传')
    expect(wrapper.get('input').isVisible()).toBeFalsy()
  })
  it('upload process should works fine', async () => {
    // change e.target.files
    // create a file
    mockedAxios.post.mockResolvedValueOnce({status: 'success'})
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(wrapper.get('button').text()).toBe('正在上传')
    // button 为 disabled
    expect(wrapper.get('button').attributes()).toHaveProperty('disabled')

    // 列表长度修改，并且有正确的 class
    expect(wrapper.findAll('li').length).toBe(1)
    const firstItem = wrapper.get('li:first-child')
    expect(firstItem.classes()).toContain('upload-loading')

    await flushPromises()
    expect(wrapper.get('button').text()).toBe('点击上传')

    // 有正确的 class，并且文件名称相对应
    expect(firstItem.classes()).toContain('upload-success')
    expect(wrapper.get('.filename').text()).toBe(testFile.name)
  })
  it('should return error text when post is rejected', async () => {
    mockedAxios.post.mockRejectedValueOnce({status: 'error'})
    await wrapper.get('input').trigger('change')
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(wrapper.get('button').text()).toBe('正在上传')
    await flushPromises()
    expect(wrapper.get('button').text()).toBe('点击上传')

    // 列表长度增加，并且列表的最后一项有正确的 class 名
    expect(wrapper.findAll('li').length).toBe(2)
    const lastItem = wrapper.get('li:last-child')
    expect(lastItem.classes()).toContain('upload-error')

    // 点击列表中右侧的 button，可以删除这一项
    await lastItem.get('.delete-icon').trigger('click')
    expect(wrapper.findAll('li').length).toBe(1)
  })
  it('should show the corrent interface when using custom slot', async () => {
    mockedAxios.post.mockResolvedValueOnce({data: {url: 'dummy.url'}})
    mockedAxios.post.mockResolvedValueOnce({data: {url: 'xyz.url'}})
    const wrapper = mount(Uploader, {
      props: {
        action: 'test.url',
      },
      slots: {
        default: '<button>Custom button</button>',
        loading: '<div class="loading">custom loading</div>',
        uploaded: `<template #uploaded="{ uploadedData }">
          <div class="custom-loaded">{{uploadedData.url}}</div>
        </template>`,
      },
      global: {
        stubs: mockComponents,
      },
    })
    expect(wrapper.get('button').text()).toBe('Custom button')
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    expect(wrapper.get('.loading').text()).toBe('custom loading')
    await flushPromises()
    expect(wrapper.get('.custom-loaded').text()).toBe('dummy.url')
    await wrapper.get('input').trigger('change')
    expect(wrapper.get('.loading').text()).toBe('custom loading')
    await flushPromises()
    expect(wrapper.get('.custom-loaded').text()).toBe('xyz.url')
  })
  it('before upload check', async () => {
    const callback = jest.fn()
    mockedAxios.post.mockResolvedValueOnce({data: {url: 'dummy.url'}})
    const checkFileSize = (file: File) => {
      if (file.size > 2) {
        callback()
        return false
      }
      return true
    }
    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        beforeUpload: checkFileSize,
      },
    })
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    expect(mockedAxios.post).not.toHaveBeenCalled()
    expect(wrapper.findAll('li').length).toBe(0)
    expect(callback).toHaveBeenCalled()
  })
  it('before upload check using Promise', async () => {
    mockedAxios.post.mockResolvedValueOnce({data: {url: 'dummy.url'}})

    const failedPromise = (file: File) => {
      return Promise.reject('wrong type')
    }

    const successPromise = (file: File) => {
      const newFile = new File([file], 'new_name.docx', {type: file.type})
      return Promise.resolve(newFile)
    }

    const successPromiseWithWrongType = () => {
      return Promise.resolve('abcd')
    }

    const wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
        beforeUpload: failedPromise,
      },
    })

    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    await flushPromises()
    expect(mockedAxios.post).not.toHaveBeenCalled()
    expect(wrapper.findAll('li').length).toBe(0)
    // success promise with wrong file type
    await wrapper.setProps({beforeUpload: successPromiseWithWrongType})
    await wrapper.get('input').trigger('change')
    await flushPromises()
    expect(mockedAxios.post).not.toHaveBeenCalled()
    expect(wrapper.findAll('li').length).toBe(0)
    // success promise with success file type
    await wrapper.setProps({beforeUpload: successPromise})
    await wrapper.get('input').trigger('change')
    await flushPromises()
    expect(mockedAxios.post).toHaveBeenCalled()
    expect(wrapper.findAll('li').length).toBe(1)
    const firstItem = wrapper.get('li:first-child')
    expect(firstItem.classes()).toContain('upload-success')
    expect(wrapper.get('.filename').text()).toBe('new_name.docx') 
  })
  afterEach(() => {
    mockedAxios.post.mockReset()
  })
})
