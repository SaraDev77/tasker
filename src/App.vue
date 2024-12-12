<script setup lang="ts">
import { RouterView } from 'vue-router'
import SidebarComponent from './components/SidebarComponent.vue'
import 'primeicons/primeicons.css'
</script>

<template>
  <main class="flex max-w-screen bg-slate-50 h-screen">
    <SidebarComponent v-if="!$route.meta.hideSidebar" />
    <div class="flex flex-col w-full flex-1 overflow-y-scroll">
      <RouterView />
    </div>
  </main>
</template>
