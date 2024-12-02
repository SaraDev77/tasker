<template>
  <Card style="overflow: hidden" :class="[cardColor, 'border border-slate-400']">
    <template #title>
      <div class="flex justify-between">
        {{ props.title }}
        <div class="flex gap-2">
          <!-- Mark as In Progress Icon (Play Circle) -->
          <i
            @click="start"
            v-if="props.status === Status.PENDING"
            class="pi pi-play-circle text-green-400 cursor-pointer"
          ></i>

          <!-- Mark as Completed Icon (Check Circle) -->
          <i
            @click="completed"
            v-if="props.status !== Status.COMPLETED"
            class="pi pi-check-circle text-blue-600 cursor-pointer"
          ></i>
        </div>
      </div>
    </template>
    <template #subtitle>{{ props.deadline }}</template>
    <template #content>
      <RouterLink :to="`/details/${props._id}`">
        <div class="min-w-full cursor-pointer">
          <p class="m-0 break-words whitespace-normal">
            {{
              props.status.charAt(0).toUpperCase() +
              props.status.slice(1).toLowerCase().replace('_', ' ')
            }}
          </p>
        </div>
      </RouterLink>
    </template>
    <template #footer>
      <div class="flex gap-4 mt-1">
        <Button
          label="Edit"
          class="w-full !bg-sky-700 hover:!bg-sky-600"
          @click="handlesEditClick"
        />
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
import { Button, Card, useToast } from 'primevue'
import type { Task } from '../models/task.type'
import { Status } from '../models/status.enum'
import { ref, watchEffect } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { queryClient } from '../providers/queryClient'
import { useTasksStore } from '../stores/tasks'

const props = defineProps<Task>()
const cardColor = ref('')
const toast = useToast()
const tasksStore = useTasksStore()
const taskState = ref('')
watchEffect(() => {
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
  }
})

const showErrToast = () => {
  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: 'An error occurred, could not submit!',
    life: 3000,
  })
}

const showSuccessToast = () => {
  toast.add({
    severity: 'success',
    summary: 'Succeeded!',
    detail: 'Form submitted successfully!',
    life: 3000,
  })
}

const start = () => {
  taskState.value = 'start'
  mutate(props._id)
}
const completed = () => {
  taskState.value = 'complete'
  mutate(props._id)
}
const { mutate } = useMutation({
  mutationFn: () => {
    if ((taskState.value === 'complete')) {
      return tasksStore.completeTask(props._id)
    } else if ((taskState.value === 'start')) {
      return tasksStore.startTask(props._id)
    }
  },
  onSuccess: () => {
    queryClient.invalidateQueries(['tasks'])
    showSuccessToast()
  },
  onError: () => {
    showErrToast()
  },
})

const emit = defineEmits<{
  (e: 'deleteTask'): void
  (e: 'editTask'): void
}>()

const handlesDeleteClick = () => {
  emit('deleteTask')
}

const handlesEditClick = () => {
  emit('editTask')
}
</script>
