import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import App from './App.vue'
import router from './router'
import { DialogService, ToastService } from 'primevue'
import { VueQueryPlugin, vueQueryOptions } from './providers/queryClient'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(createPinia())
app.use(router)
app.use(DialogService)
app.use(ToastService)
app.use(VueQueryPlugin, vueQueryOptions)
app.mount('#app')
