import UserProfile from '@components/UserProfile.vue'
import {mount, VueWrapper} from '@vue/test-utils'
// import UserProfile from '../../src/components/UserProfile.vue'

let wrapper: VueWrapper<any>

jest.mock('ant-design-vue')
jest.mock('vuex')
jest.mock('vue-router')

describe('UserProfile component', () => {
  beforeAll(() => {
    wrapper = mount(UserProfile, {
      props: {
        user: {
          isLogin: false,
        },
      },
    })
  })

  it('should render login button when login is false', () => {
    console.log(wrapper.html())
  })
  //   it('should render username when login is true', () => {})
  //   afterAll(() => {})
})
