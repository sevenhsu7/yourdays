import { createApp } from 'vue'
import App from './App.vue'
import router from './router'         

import './styles/progress-common.css'  // 全局导入样式

const app = createApp(App)
app.use(router)  // 确保这行在 mount 之前
app.mount('#app')