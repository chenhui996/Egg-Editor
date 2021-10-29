import {shallowMount, VueWrapper} from '@vue/test-utils'
import Uploader from '@/components/Uploader.vue'
import axios from 'axios'
import flushPromises from 'flush-promises'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
let wrapper: VueWrapper<any>
const testFile = new File(['xyz'], 'test.png', {type: 'image/png'})

describe('Uploader Component', () => {
  beforeAll(() => {
    wrapper = shallowMount(Uploader, {
      props: {
        action: 'test.url',
      },
    })
  })
  it('basic layout before uploading', () => {
    expect(wrapper.find('button').exists()).toBeTruthy()
    expect(wrapper.get('button span').text()).toBe('点击上传')
    expect(wrapper.get('input').isVisible()).toBeFalsy()
  })
  it('upload process should works fine', async () => {
    // change e.target.files
    // create a file
    mockedAxios.post.mockResolvedValueOnce({status: 'success'}) // mock post -> 发生 post - 基于此定义调用
    const fileInput = wrapper.get('input').element as HTMLInputElement
    const files = [testFile] as any

    // 由于 unit test 无法模拟 交互的过程 -> 故 input 上传文件操作 -> 直接将文件塞入 input 的 files 属性中。
    Object.defineProperty(fileInput, 'files', {
      value: files,
      writable: false,
    })
    await wrapper.get('input').trigger('change')
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(wrapper.get('button span').text()).toBe('正在上传')
    // button 为 disabled
    expect(wrapper.get('button').attributes()).toHaveProperty('disabled')

    // 列表长度修改，并且有正确的 class
    const firstItem = wrapper.get('li:first-child')
    expect(firstItem.classes()).toContain('upload-loading')

    await flushPromises()
    expect(wrapper.get('button span').text()).toBe('点击上传')

    // 有正确的 class，并且文件名称相对应
    expect(firstItem.classes()).toContain('upload-success')
    expect(wrapper.get('.filename').text()).toBe(testFile.name)
  })
  it('should return error text when post is rejected', async () => {
    mockedAxios.post.mockRejectedValueOnce({status: 'error'})
    await wrapper.get('input').trigger('change')
    expect(mockedAxios.post).toHaveBeenCalledTimes(2)
    expect(wrapper.get('button span').text()).toBe('正在上传')
    await flushPromises()
    expect(wrapper.get('button span').text()).toBe('点击上传')

    // 列表长度增加，并且列表的最后一项有正确的 class 名
    expect(wrapper.findAll('li').length).toBe(2)
    const lastItem = wrapper.get('li:last-child')
    expect(lastItem.classes()).toContain('upload-error')

    // 点击列表中右侧的 button，可以删除这一项
    await lastItem.get('.delete-icon').trigger('click')
    expect(wrapper.findAll('li').length).toBe(1)
  })
})
