<template>
  <Card
    style="overflow: hidden"
    :class="[cardColor, 'border border-slate-400 !flex !flex-col !justify-between']"
  >
    <template #title>
      <div class="flex justify-between">
        {{ props.title }}
        <div class="flex gap-2">
          <i
            v-tooltip.top="'Make Task In Progress'"
            @click="start"
            v-if="props.status === Status.PENDING"
            class="pi pi-play-circle text-green-400 cursor-pointer"
          ></i>
          <i
            v-tooltip.top="'Mark As Completed'"
            @click="completed"
            v-if="props.status !== Status.COMPLETED"
            class="pi pi-check-circle text-blue-600 cursor-pointer"
          ></i>
        </div>
      </div>
    </template>
    <template #subtitle
      ><div v-formate-date="props.deadline!">{{ props.deadline || 'No Due Date' }}</div></template
    >
    <template #content v-if="props.status">
      <RouterLink :to="`/details/${props._id}`">
        <div class="min-w-full cursor-pointer">
          <p class="m-0 break-words whitespace-normal">
            {{ formatStatus(props.status) }}
          </p>
        </div>
      </RouterLink>
    </template>
    <template #footer>
      <div class="flex gap-4 mt-2">
        <Button
          label="Edit"
          class="w-full !bg-sky-700 hover:!bg-sky-600"
          @click="handlesEditClick"
        />
        <Button
          v-if="authStore.ability?.can('delete', 'TODOS')"
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
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { Button, Card, useToast } from 'primevue'
import { ref, watchEffect } from 'vue'
import { Status } from '../models/status.enum'
import type { Task } from '../models/task.type'
import { useTasksStore } from '../stores/tasks.store'
import { useAuthStore } from '../stores/auth.store'
import { vFormateDate } from '../custom-directives/date-formate.directive'
import { showSuccessToast } from '../utils/show-toasts.util'
import { formatStatus } from '../utils/format-status.util'

const queryClient = useQueryClient()
const props = defineProps<Task>()
const cardColor = ref('')
const tasksStore = useTasksStore()
const authStore = useAuthStore()
const toast = useToast()
const taskState = ref<(typeof TaskActions)[keyof typeof TaskActions] | null>(null)

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

const TaskActions = {
  START: 'start',
  COMPLETE: 'complete',
} as const

const handleTaskMutation = async (taskId: string, action: string) => {
  switch (action) {
    case TaskActions.START:
      return tasksStore.startTask(taskId)
    case TaskActions.COMPLETE:
      return tasksStore.completeTask(taskId)
    default:
      throw new Error('Invalid task action')
  }
}

const getToastMessage = (action: string) => {
  switch (action) {
    case TaskActions.COMPLETE:
      return 'Wohooo You Completed One More Task 🎊🥳'
    case TaskActions.START:
      return 'Task Is Marked In Progress ⌛'
    default:
      return 'Action completed successfully!'
  }
}

const { mutate } = useMutation({
  mutationFn: () => handleTaskMutation(props._id, taskState.value!),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    if (taskState.value) {
      showSuccessToast(toast, getToastMessage(taskState.value))
    }
  },
  onError: () => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to update task`,
      life: 5000,
    })
  },
})

const start = () => {
  taskState.value = TaskActions.START
  mutate()
}

const completed = () => {
  taskState.value = TaskActions.COMPLETE
  mutate()
}

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
