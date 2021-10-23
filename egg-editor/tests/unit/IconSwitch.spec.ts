import {mount, VueWrapper} from '@vue/test-utils'
import IconSwitch from '@/components/IconSwitch.vue'
let wrapper: VueWrapper<any>

const mockComponent = {
  template: '<div><slot>B</slot></div>',
}

const globalComponents = {
  'a-button': mockComponent,
  'a-tooltip': mockComponent,
}

describe('ColorPicker', () => {
  beforeAll(() => {
    wrapper = mount(IconSwitch, {
      props: {
        iconName: 'BoldOutlined',
        checked: false,
        tip: '粗体',
      },
      global: {
        components: globalComponents,
      },
    })
  })

  it('should render the correct title', () => {
    const tooltip = wrapper.findAll('.icon-template>div')[0]
    // 判断传入的title
    expect(tooltip.attributes('title')).toBe('粗体')
  })
  it('test title position', () => {
    const tooltip = wrapper.findAll('.icon-template>div')[0]
    expect(tooltip.attributes('placement')).toBe('top')
  })
  it('test click active', () => {
    expect(wrapper.props('checked')).toBeFalsy()
    const item = wrapper.find('.icon-template')
    item.trigger('click')
    const events = wrapper.emitted('change') as unknown[]
    expect(events[0]).toEqual([true])
  })
  it('test click not active', async () => {
    await wrapper.setProps({checked: true})
    const item = wrapper.find('.icon-template')
    await item.trigger('click')
    const events = wrapper.emitted('change') as unknown[]
    expect(events[1]).toEqual([false])
  })
})
