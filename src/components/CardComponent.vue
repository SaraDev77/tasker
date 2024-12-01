<template>
  <Card style="overflow: hidden" :class="[cardColor,'border border-slate-400']">
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
import { Status } from '../models/status.enum'
import { ref, watchEffect } from 'vue'
const props = defineProps<Task>()
const cardColor = ref('')
watchEffect(()=>{
  switch (props.status) {
    case Status.COMPLETED:
      cardColor.value = '!bg-green-50'
      break
    case Status.IN_PROGRESS:
      cardColor.value = '!bg-yellow-50'
      break
    case Status.PENDING:
      cardColor.value = '!bg-sky-50'
      break
    default:
      cardColor.value = '!bg-gray-50'
  }})

const emit = defineEmits<{
  (e: 'deleteTask', id: string): void
  (e: 'editTask'): void
}>()

const handlesDeleteClick = () => {
  emit('deleteTask', props._id)
}
</script>
