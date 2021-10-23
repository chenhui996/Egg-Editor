import {mount, VueWrapper} from '@vue/test-utils'
import IconSwitch from '@/components/IconSwitch.vue'
let wrapper: VueWrapper<any>

const mockComponent = {
  template: '<button><slot name="icon"><slot></slot></slot></button>',
}

const mockComponent3 = {
  template: '<div><slot name="title"></slot><slot></slot></div>',
}

const globalComponents = {
  'a-button': mockComponent,
  'a-tooltip': mockComponent3,
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

  it('should render the correct interface', () => {
    //  <div class="icon-template" @click.prevent="handleClick">
    //    <a-tooltip>
    //      <template v-slot:title>{{ tip }}</template>
    //      <a-button :type="checked ? 'primary' : 'default'">
    //        <template v-slot:icon><component :is="iconName" /></template>
    //      </a-button>
    //    </a-tooltip>
    //  </div>
    // console.log(wrapper.html())
    const item = wrapper.find('.icon-template')
    item.trigger('click')
    const events = wrapper.emitted('change') as unknown[]
    expect(events[0]).toEqual([true])
  })
  it('should render the correct interface', () => {
    const item = wrapper.find('.icon-template')
    item.trigger('click')
    const events = wrapper.emitted('change') as unknown[]
    expect(events[1]).toEqual([true])
  })
})
