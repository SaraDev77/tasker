import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import App from './App.vue'
import router from './router'
import { DialogService, Toast, ToastService } from 'primevue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from './providers/queryClient'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useAuthStore } from './stores/auth.store'
import { abilitiesPlugin, Can } from '@casl/vue'
import { vFormateDate } from './custom-directives/date-formate.directive'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
const authStore = useAuthStore()
authStore.initializePermissions()
app
  .use(abilitiesPlugin, authStore.ability!, { useGlobalProperties: true })
  .component(Can.name!, Can)
app.use(router)
app.use(DialogService)
app.use(ToastService)
app.use(VueQueryPlugin)
app.provide(VueQueryPlugin, { queryClient })
app.directive('formate-date', vFormateDate);
app.component('ToastComponent', Toast)
app.mount('#app')
