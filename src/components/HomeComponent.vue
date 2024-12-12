<template>
  <div v-if="isLoading" class="min-h-full min-w-full flex justify-center place-items-center">
    <h1>Loading .....</h1>
  </div>
  <div class="flex flex-col place-items-center lg:p-10 w-full p-5">
    <ToolbarComponent @search-tasks="onSearchTasks" />
    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 w-full"
      v-if="displayedTasks.length > 0"
    >
      <CardComponent
        v-for="task in displayedTasks"
        :key="task._id"
        :title="task.title"
        :status="task.status"
        :deadline="new Date(task.deadline)"
        :description="task.description"
        :created-by="task.createdBy"
        :_id="task._id"
        @edit-task="displayOverlay(task)"
        @delete-task="displayWarningOverlay(task._id)"
      />
    </div>
    <div
      class="flex justify-center place-items-center"
      v-else-if="!isLoading"
    >
      <h2 class="text-2xl text-gray-900 text-bold">No Tasks Match This Search!</h2>
    </div>
  </div>
  <OverlayComponent :is-visible="showOverlay" @closeOverlay="closeOverlay">
    <EditFormComponent :close-overlay="closeOverlay" :initial-data="selectedTask!" />
  </OverlayComponent>
  <OverlayComponent :is-visible="showWarningOverlay" @closeOverlay="closeWarningOverlay">
    <div class="rounded-md flex flex-col justify-center place-items-center gap-4">
      <h1 class="text-lg text-gray-800 font-semibold">
        Are you sure you want to delete this task?
      </h1>
      <div class="flex gap-2">
        <Button @click="confirmDelete" class="!bg-red-600 !border-none !px-9 hover:!bg-red-500">Yes</Button>
        <Button class="!bg-gray-200 !text-gray-800 !border-none hover:!bg-gray-300" @click="closeWarningOverlay">Cancel</Button>
      </div>
    </div>
  </OverlayComponent>
  <ToastComponent />
</template>

<script setup lang="ts">
import { useTasksStore } from '../stores/tasks.store'
import CardComponent from './CardComponent.vue'
import type { Task } from '../models/task.type'
import { computed, ref } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import OverlayComponent from './OverlayComponent.vue'
import { useUrlSearchParams } from '@vueuse/core'
import ToolbarComponent from './ToolbarComponent.vue'
import { Button, useToast } from 'primevue'
import { queryClient } from '../providers/queryClient'
import { Status } from '../models/status.enum'
import { showErrToast, showSuccessToast } from '../utils/show-toasts.util'
import EditFormComponent from './form/EditFormComponent.vue'
import { useAuthStore } from '../stores/auth.store'
import { UserRole } from '../models/user-role.enum'
import { useDebounceFn } from '@vueuse/core'

const params = useUrlSearchParams()
const searchQuery = ref(params.search || '')
const selectedTask = ref<Task | null>(null)
const id = ref<string | null>(null)
const showWarningOverlay = ref<boolean>(false)
const showOverlay = ref<boolean>(false)
const tasksStore = useTasksStore()
const authStore = useAuthStore()
const toast = useToast()

const closeOverlay = () => {
  showOverlay.value = false
}

const displayOverlay = (task: Task) => {
  selectedTask.value = task
  showOverlay.value = true
}

const closeWarningOverlay = () => {
  showWarningOverlay.value = false
}

const displayWarningOverlay = (taskId: string) => {
  id.value = taskId
  showWarningOverlay.value = true
}

const onSearchTasks = useDebounceFn((value: string) => {
  searchQuery.value = value
}, 1000)

const { data, isLoading } = useQuery({
  queryKey: computed(() => ['tasks', searchQuery.value]),
  queryFn: tasksStore.fetchTasks,
  select: (data: Task[]) => {
    const filteredTasks = searchQuery.value
      ? data.filter((task) =>
          task.title.toLowerCase().includes(searchQuery.value.toString().toLowerCase()),
        )
      : data

    return authStore.user?.role === UserRole.ADMIN
      ? filteredTasks.filter((task) => task.status !== Status.COMPLETED)
      : filteredTasks
  },
})

const confirmDelete = async () => {
  if (!id.value) return
  mutate(id.value)
}

const { mutate } = useMutation({
  mutationFn: async (taskId: string) => tasksStore.deleteTask(taskId),
  onSuccess: () => {
    queryClient.invalidateQueries(['tasks'])
    showSuccessToast(toast, 'Task successfully deleted!')
    closeWarningOverlay()
  },
  onError: () => {
    showErrToast(toast, 'An error occurred while deleting the task!')
  },
})

const displayedTasks = computed(() => data.value || [])
</script>
