<template>
  <div class="card fixed top-0 right-0 shadow-md z-10">
    <Toolbar class="!bg-sky-200 !bg-opacity-15">
      <template #start>
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText placeholder="Search" />
        </IconField>
      </template>

      <template #end>
        <Button
          @click="handleAdding"
          icon="pi pi-plus"
          class="mr-2 !bg-sky-700 hover:!bg-sky-600 !rounded-full"
      /></template>
    </Toolbar>
  </div>
</template>

<script setup lang="ts">
import { Button, IconField, InputIcon, InputText, Toolbar } from 'primevue'
import { ref } from 'vue'

const taskDetails = ref('')
const emit = defineEmits<{
  (e: 'newTask', data: string): void
}>()
function handleAdding() {
  emit('newTask', taskDetails.value)
  taskDetails.value = ''
}
</script>
