import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import App from './App.vue'
import router from './router'
import { DialogService, ToastService } from 'primevue'

import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from './providers/queryClient'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(createPinia())

pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(DialogService)
app.use(ToastService)
app.use(VueQueryPlugin)
app.provide(VueQueryPlugin, { queryClient })
app.mount('#app')
