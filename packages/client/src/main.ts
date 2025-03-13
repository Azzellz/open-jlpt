import './assets/main.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App'
import router from './router'
import i18nConfig from './i18n.config'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18nConfig)

app.mount('#app')
