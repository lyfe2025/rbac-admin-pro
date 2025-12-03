import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import directive from './directive' // directive
import './style.css'
import './permission' // permission control

const app = createApp(App)

app.use(createPinia())
app.use(router)
directive(app)

app.mount('#app')
