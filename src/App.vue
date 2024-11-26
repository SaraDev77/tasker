<script setup lang="ts">
import { RouterView } from 'vue-router'
import SidebarComponent from './components/SidebarComponent.vue'
import 'primeicons/primeicons.css'
</script>

<template>
  <div class="flex">
    <!-- <nav class="bg-green-400">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->
    <SidebarComponent />
    <RouterView />
  </div>
</template>
