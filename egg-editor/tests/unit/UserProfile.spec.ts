import UserProfile from '@/components/UserProfile.vue'
import {mount, VueWrapper} from '@vue/test-utils'
// import UserProfile from '../../src/components/UserProfile.vue'

let wrapper: VueWrapper<any>

jest.mock('ant-design-vue')
jest.mock('vuex')
jest.mock('vue-router')

const mockComponent = {
  template: '<div><slot></slot></div>',
}

const mockComponent2 = {
  template: '<div><slot></slot><slot name="overlay"></slot></div>',
}

const globalComponents = {
  'a-button': mockComponent,
  'a-dropdown-button': mockComponent2,
  'router-link': mockComponent,
  'a-menu': mockComponent,
  'a-menu-item': mockComponent,
}

describe('UserProfile component', () => {
  beforeAll(() => {
    wrapper = mount(UserProfile, {
      props: {
        user: {
          isLogin: false,
        },
      },
      global: {
        components: globalComponents,
      },
    })
  })

  it('should render login button when login is false', () => {
    console.log(wrapper.html())
    expect(wrapper.get('div').text()).toBe('登录')
  })

  it('should render username when login is true', async () => {
    await wrapper.setProps({
      user: {
        isLogin: true,
        userName: 'cain',
      },
    })
    console.log(wrapper.html())
    expect(wrapper.get('.user-profile-component').html()).toContain('cain')
    expect(wrapper.find('.user-profile-dropdown').exists()).toBeTruthy()
  })

  // afterAll(() => {})
})
