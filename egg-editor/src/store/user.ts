import {Module} from 'vuex'
import {GlobalDataProps} from './index'
export interface UserProps {
  isLogin: boolean;
  userName?: string;
}

export const user: Module<UserProps, GlobalDataProps> = {
  mutations: {
    login(state) {
      state.isLogin = true
      state.userName = 'cain'
    },
    logout(state) {
      state.isLogin = false
    },
  },
}

export default user
