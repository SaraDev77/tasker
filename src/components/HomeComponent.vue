<template>
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
      />
    </div>
    <div class="flex justify-center place-items-center" v-else><h2 class="text-2xl text-gray-900 text-bold">No Tasks Mathches This Search !</h2></div>
  </div>
  <OverlayComponent :is-visible="showOverlay" @closeOverlay="closeOverlay">
    <FormComponent mode="edit" :close-overlay="closeOverlay" :initial-data="selectedTask" />
  </OverlayComponent>
</template>

<script setup lang="ts">
import { useTasksStore } from '../stores/tasks'
import CardComponent from './CardComponent.vue'
import type { Task } from '../models/task.type'
import { computed, onMounted } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { ref } from 'vue'
import OverlayComponent from './OverlayComponent.vue'
import FormComponent from './FormComponent.vue'
import { useUrlSearchParams } from '@vueuse/core'
import ToolbarComponent from './ToolbarComponent.vue'

const params = useUrlSearchParams()
const searchQuery = ref(params.search || '')
console.log(searchQuery.value)
const selectedTask = ref<Task>()
const closeOverlay = () => {
  showOverlay.value = false
}
const displayOverlay = (task: Task) => {
  selectedTask.value = task
  showOverlay.value = true
}
const showOverlay = ref<boolean>(false)
const tasksStore = useTasksStore()

const { data } = useQuery<Task[]>({
  queryKey: ['todos'],
  queryFn: tasksStore.fetchTasks,
})

const onSearchTasks = (value: string) => {
  searchQuery.value = value
}
const filtered = computed(() => {
  const term = searchQuery.value.toString().toLowerCase().trim()
  return data.value
    ? data.value.filter((task: Task) => task.title.toLowerCase().includes(term))
    : []
})

const displayedTasks = computed(() => {
  return filtered.value.length > 0 ? filtered.value :  []
})

onMounted(async () => {tasksStore.fetchTasks()})
</script>
