<template>
  <Card style="overflow: hidden" >
    <template #title>{{ props.title }}</template>
    <template #subtitle>{{ props.deadline }}</template>
    <template #content>
      <div class="min-w-full">
        <p class="m-0 break-words whitespace-normal">
          {{ props.status }}
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-4 mt-1">
        <Button label="Edit" class="w-full !bg-sky-700 hover:!bg-sky-600" />
        <Button
          label="Delete"
          severity="danger"
          outlined
          class="w-full"
          @click="handlesDeleteClick"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { Button, Card } from 'primevue'
import type { Task } from '../models/task.type'

const props = defineProps<Task>()
const emit = defineEmits<{
  (e: 'deleteTask', id: string): void
  (e: 'editTask'): void
}>()

const handlesDeleteClick = () => {
  emit('deleteTask', props._id)
}
</script>
