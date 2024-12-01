<template>
  <div class="flex flex-col place-items-center lg:p-10 w-full p-5">
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 w-full">
      <CardComponent
        v-for="task in data"
        :key="task._id"
        :title="task.title"
        :status="task.status"
        :deadline="task.deadline"
        :description="task.description"
        :created-by="task.createdBy"
        :_id="task._id"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTasksStore } from '../stores/tasks'
import CardComponent from './CardComponent.vue'
import type { Task } from '../models/task.type'
import { onMounted } from 'vue'
import { useQuery } from '@tanstack/vue-query'

const tasksStore = useTasksStore()
// const tasks =tasksStore.tasks

const { data } = useQuery<Task[]>({
  queryKey: ['todos'],
  queryFn: (tasksStore.fetchTasks),
})
onMounted(tasksStore.fetchTasks)
</script>
