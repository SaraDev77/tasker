<template>
  <div v-if="isLoading" class="min-h-full min-w-full flex justify-center place-items-center">
    <LoaderComponent />
  </div>
  <div class="flex flex-col place-items-center lg:p-10 w-full p-5">
    <ToolbarComponent @search-tasks="onSearchTasks" />
    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 w-full"
      v-if="filteredTasks.length > 0"
    >
      <CardComponent
        v-for="task in filteredTasks"
        :key="task._id"
        :task="task"
        :showActions="true"
        @edit-task="displayEditOverlay(task)"
        @delete-task="displayWarningOverlay(task._id)"
      />
    </div>
    <div class="flex justify-center place-items-center" v-else-if="!isLoading">
      <h2 class="text-2xl text-gray-900 text-bold">No Tasks Match This Search!</h2>
    </div>
  </div>
  <OverlayComponent :is-visible="showOverlay" @closeOverlay="closeEditOverlay">
    <EditFormComponent :close-overlay="closeEditOverlay" :initial-data="selectedTask!" />
  </OverlayComponent>
  <OverlayComponent :is-visible="showWarningOverlay" @closeOverlay="closeWarningOverlay">
    <div class="rounded-md flex flex-col justify-center place-items-center gap-4">
      <h1 class="text-lg text-gray-800 font-semibold">
        Are you sure you want to delete this task?
      </h1>
      <div class="flex gap-2">
        <Button @click="confirmDelete" class="!bg-red-600 !border-none !px-9 hover:!bg-red-500"
          >Yes</Button
        >
        <Button
          class="!bg-gray-200 !text-gray-800 !border-none hover:!bg-gray-300"
          @click="closeWarningOverlay"
          >Cancel</Button
        >
      </div>
    </div>
  </OverlayComponent>
  <ToastComponent />
</template>

<script setup lang="ts">
import CardComponent from './CardComponent.vue'
import type { Task } from '../models/task.type'
import { computed, ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import OverlayComponent from './OverlayComponent.vue'
import { useUrlSearchParams } from '@vueuse/core'
import ToolbarComponent from './ToolbarComponent.vue'
import { Button, useToast } from 'primevue'
import { Status } from '../models/status.enum'
import { showErrToast, showSuccessToast } from '../utils/showToasts.util'
import EditFormComponent from './form/EditFormComponent.vue'
import { useAuthStore } from '../stores/auth.store'
import { UserRole } from '../models/userRole.enum'
import { useDebounceFn } from '@vueuse/core'
import LoaderComponent from './loader/LoaderComponent.vue'
import { taskService } from '../utils/tasksRequests.util'

const params = useUrlSearchParams()
const searchQuery = ref(params.search || '')
const selectedTask = ref<Task | null>(null)
const selectedTaskId = ref<string | null>(null)
const showWarningOverlay = ref<boolean>(false)
const showOverlay = ref<boolean>(false)
const authStore = useAuthStore()
const toast = useToast()
const queryClient = useQueryClient()

const closeEditOverlay = () => {
  showOverlay.value = false
}

const displayEditOverlay = (task: Task) => {
  selectedTask.value = task
  showOverlay.value = true
}

const closeWarningOverlay = () => {
  showWarningOverlay.value = false
}

const displayWarningOverlay = (taskId: string) => {
  selectedTaskId.value = taskId
  showWarningOverlay.value = true
}

const onSearchTasks = useDebounceFn((value: string) => {
  searchQuery.value = value
}, 1000)

const { data, isLoading } = useQuery({
  queryKey:['tasks'],
  queryFn: taskService.fetchTasks,
  select: (data: Task[]) => {
    return authStore.user?.role === UserRole.ADMIN
      ? data.filter((task) => task.status !== Status.COMPLETED)
      : data
  },
})

const filteredTasks = computed(() => {
  if (!data.value) return [] 
  if (!searchQuery.value) return data.value 
  const searchLowerCase = searchQuery.value.toString().toLowerCase()
  return data.value.filter((task: Task) => 
    task.title.toLowerCase().includes(searchLowerCase)
  )
})

const confirmDelete = async () => {
  if (!selectedTaskId.value) return
  mutate(selectedTaskId.value)
}

const { mutate } = useMutation({
  mutationFn: async (taskId: string) => taskService.deleteTask(taskId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    showSuccessToast(toast, 'Task successfully deleted!')
    closeWarningOverlay()
  },
  onError: () => {
    showErrToast(toast, 'An error occurred while deleting the task!')
  },
})

</script>
