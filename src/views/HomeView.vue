<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Message } from 'primevue'
import HomeComponent from '../components/HomeComponent.vue'
import KnobComponent from '../components/KnobComponent.vue'
import { useAuthStore } from '../stores/auth.store'
import { UserRole } from '../models/user-role.enum'

const showWarning = ref(false)
const authStore = useAuthStore()

onMounted(() => {
  showWarning.value = true
  setTimeout(() => {
    showWarning.value = false
  }, 60000)
})
</script>

<template>
  <KnobComponent />
  <div class="max-w-full mx-2">
    <Message v-if="showWarning && authStore.user?.role === UserRole.ADMIN" severity="warn" closable
      >If You Want To Delete Overdue Tasks (Red Colored Cards) You Should Contact Your Super
      Admin</Message
    >
  </div>
  <HomeComponent />
</template>
