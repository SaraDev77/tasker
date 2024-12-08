import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import App from './App.vue'
import router from './router'
import { DialogService, Toast, ToastService} from 'primevue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from './providers/queryClient'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useAuthStore } from './stores/auth'
import { abilitiesPlugin, Can } from '@casl/vue'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.use(createPinia())
const authStore = useAuthStore()
authStore.initializePermissions()
const pinia = createPinia()
app
  .use(abilitiesPlugin, authStore.ability!, { useGlobalProperties: true })
  .component(Can.name!, Can)
pinia.use(piniaPluginPersistedstate)
app.use(router)
app.use(DialogService)
app.use(ToastService)
app.use(VueQueryPlugin)
app.provide(VueQueryPlugin, { queryClient })
app.use(ToastService);
app.component('ToastComponent', Toast);
app.mount('#app')
