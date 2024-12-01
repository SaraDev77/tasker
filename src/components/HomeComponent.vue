<template>
  <div class="flex flex-col place-items-center lg:p-10 w-full p-5" >
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 w-full">
      <div
        v-for="(status, index) in taskStatuses"
        :key="index"
        :class="[status.bgColor, 'p-4', 'rounded-lg', 'flex', 'flex-col', 'gap-4']"
      >
        <CardComponent
          v-for="task in filteredTasks(status.key)"
          :title="task.title"
          :status="task.status"
          :deadline="task.deadline"
          :description="task.description"
          :created-by="task.createdBy"
          :_id="task._id"
          :key="task._id"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTasksStore } from '../stores/tasks'
import CardComponent from './CardComponent.vue'
import { Status } from '../models/status.enum'
import type { Task } from '../models/task.type'
import { onMounted } from 'vue'



const tasksStore = useTasksStore()
// const tasks = tasksStore.tasks
const tasks=tasksStore.tasks
console.log(tasks);
const taskStatuses = [
  { key: Status.PENDING, label: 'To Do', bgColor: 'bg-yellow-100' },
  { key: Status.IN_PROGRESS, label: 'In Progress', bgColor: 'bg-blue-100' },
  { key: 'approval', label: 'On Approval', bgColor: 'bg-green-100' },
  { key: Status.COMPLETED, label: 'Done', bgColor: 'bg-pink-100' },
]

const filteredTasks = (status: string) =>
tasks?.filter((task: Task) => task.status === status)
onMounted(tasksStore.fetchTasks)
</script>
