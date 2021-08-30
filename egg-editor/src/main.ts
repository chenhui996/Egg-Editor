import {createApp} from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import router from './routes/index'
import store from './store/index'
import 'ant-design-vue/dist/antd.css'

createApp(App).use(Antd).use(router).use(store).mount('#app')
