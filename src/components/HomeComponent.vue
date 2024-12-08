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
        :deadline="task.deadline"
        :description="task.description"
        :created-by="task.createdBy"
        :_id="task._id"
        @edit-task="displayOverlay(task)"
        @delete-task="displayWarningOverlay(task._id)"
      />
    </div>
    <div class="flex justify-center place-items-center" v-else>
      <h2 class="text-2xl text-gray-900 text-bold">No Tasks Mathches This Search !</h2>
    </div>
  </div>
  <OverlayComponent :is-visible="showOverlay" @closeOverlay="closeOverlay">
    <FormComponent mode="edit" :close-overlay="closeOverlay" :initial-data="selectedTask" />
  </OverlayComponent>
  <OverlayComponent :is-visible="showWarningOverlay" @closeOverlay="closeWarningOverlay">
    <div class="rounded-md flex flex-col justify-center place-items-center gap-4">
      <h1 class="text-lg text-gray-800 font-semibold">
        Are You Sure That You Want To Delete This Task !
      </h1>
      <div class="flex gap-2 flex-end">
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
  <Toast />
</template>

<script setup lang="ts">
import { useTasksStore } from '../stores/tasks'
import CardComponent from './CardComponent.vue'
import type { Task } from '../models/task.type'
import { computed, onMounted } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { ref } from 'vue'
import OverlayComponent from './OverlayComponent.vue'
import FormComponent from './FormComponent.vue'
import { useUrlSearchParams } from '@vueuse/core'
import ToolbarComponent from './ToolbarComponent.vue'
import { Button } from 'primevue'
import { queryClient } from '../providers/queryClient'
import { Status } from '../models/status.enum'
import { showErrToast, showSuccessToast } from '../utils/show-toasts'

const params = useUrlSearchParams()
const searchQuery = ref(params.search || '')
const selectedTask = ref<Task>()
const id = ref<string>()
const showWarningOverlay = ref<boolean>(false)
const showOverlay = ref<boolean>(false)
const tasksStore = useTasksStore()

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

const { data, isLoading } = useQuery<Task[]>({
  queryKey: ['todos'],
  queryFn: tasksStore.fetchTasks,
})

const onSearchTasks = (value: string) => {
  searchQuery.value = value
}

const filteredTasksList = computed(() => {
  const term = searchQuery.value.toString().toLowerCase().trim()
  return data.value
    ? data.value.filter(
        (task: Task) => task.title.toLowerCase().includes(term) && task.status !== Status.COMPLETED,
      )
    : []
})

const confirmDelete = () => {
  mutate(id.value)
}

const { mutate } = useMutation({
  mutationFn: (id: string) => {
    tasksStore.deleteTask(id)
  },
  onSuccess: () => {
    queryClient.invalidateQueries(['tasks'])
    showSuccessToast('Form Submitted Successfully')
  },
  onError: () => {
    showErrToast('Form Submittion Failed !')
  },
})

const displayedTasks = computed(() => {
  return filteredTasksList.value.length > 0 ? filteredTasksList.value : []
})

onMounted(async () => {
  tasksStore.fetchTasks()
})
</script>
