import {createApp} from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import router from './routes/index'
import 'ant-design-vue/dist/antd.css'
createApp(App)
  .use(Antd)
  .use(router)
  .mount('#app')
