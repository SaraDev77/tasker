<template>
  <div class="card fixed top-0 right-0 shadow-md z-10">
    <Toolbar class="!bg-sky-200 !bg-opacity-15">
      <template #start>
        <IconField>
          <InputIcon>
            <i class="pi pi-search text-green-300" @click="emitSearch" />
          </InputIcon>
          <InputText placeholder="Search" v-model="searchQuery" />
        </IconField>
      </template>
      <template #end>
        <Button
          @click="(showOverlay = true)"
          icon="pi pi-plus"
          class="mr-2 !bg-sky-700 hover:!bg-sky-600 !rounded-full"
        />
      </template>
    </Toolbar>
    <OverlayComponent :is-visible="showOverlay" @closeOverlay="closeOverlay">
      <FormComponent mode="add" :close-overlay="closeOverlay" />
    </OverlayComponent>
  </div>
</template>

<script setup lang="ts">
import { Button, IconField, InputIcon, InputText, Toolbar } from 'primevue'
import { computed, ref } from 'vue'
import OverlayComponent from './OverlayComponent.vue'
import FormComponent from './FormComponent.vue'
import { useUrlSearchParams } from '@vueuse/core'

const closeOverlay = () => {
  showOverlay.value = false
}
const showOverlay = ref<boolean>(false)

const params = useUrlSearchParams('history', { removeNullishValues: true })
const searchQuery = computed({
  get: () => {
    const value = params.search
    return Array.isArray(value) ? value.join(', ') : value || ''
  },
  set: (value) => {
    params.search = value || []
    emitSearch()
  },
})

const emit = defineEmits<{
  (e: 'searchTasks', value: string): void
}>()
const emitSearch = () => {
  emit('searchTasks', searchQuery.value)
}
</script>
