import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import App from './App.vue'
import router from './router'
import { DialogService, Toast, ToastService } from 'primevue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import Tooltip from 'primevue/tooltip';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useAuthStore } from './stores/auth.store'
import { abilitiesPlugin, Can } from '@casl/vue'
import { vFormateDate } from './custom-directives/date-formate.directive'

// Create the Vue app
const app = createApp(App)

// Configure PrimeVue with the Aura theme
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

// Initialize Pinia and its plugin for persisted state
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Initialize the auth store and permissions
const authStore = useAuthStore()
authStore.initializePermissions()

// Use VueQueryPlugin

app.use(VueQueryPlugin)

// Use other plugins and services
app
  .use(abilitiesPlugin, authStore.ability!, { useGlobalProperties: true })
  .component(Can.name!, Can)
app.use(router)
app.use(DialogService)
app.use(ToastService)

// Register directives and components
app.directive('formate-date', vFormateDate)
app.component('ToastComponent', Toast)
app.directive('tooltip', Tooltip);
// Mount the app
app.mount('#app')
