<script setup lang="ts">
import { Message } from 'primevue'
import HomeComponent from '../components/HomeComponent.vue'
import KnobComponent from '../components/KnobComponent.vue'
</script>

<template>
  <KnobComponent />
  <div class="max-w-full mx-2">
    <Message severity="warn" closable
      >If You Want To Delete Overdue Tasks (Red Colored Cards)You Should Contact Your Super
      Admin</Message
    >
  </div>
  <HomeComponent />
</template>
