<script setup lang="ts">
import { RouterView } from 'vue-router'
import SidebarComponent from './components/SidebarComponent.vue'
import 'primeicons/primeicons.css'
import ToolbarComponent from './components/ToolbarComponent.vue';
</script>

<template>
  <main class="flex w-screen bg-slate-50 min-h-screen">
    <!-- <nav class="bg-green-400">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->
      <SidebarComponent />
      <div class="flex flex-col w-full"> <ToolbarComponent/>
    <RouterView /></div>
     
  </main>
</template>
