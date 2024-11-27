<template>
  <div class="flex flex-col place-items-center lg:p-10 w-full p-5">
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 w-full">
      <!-- Loop through statuses -->
      <div
        v-for="(status, index) in taskStatuses"
        :key="index"
        class="p-4 rounded-lg flex flex-col gap-4"
        :class="status.bgColor"
      >
        <CardComponent
          v-for="task in filteredTasks(status.key)"
          :title="task.title"
          :status="task.status"
          :deadline="task.deadline"
          :id="task.id"
          :key="task.id"
          @deleteTask="handleDeleteTask"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '../models/task.type'
import CardComponent from './CardComponent.vue'
import { Status } from '../models/status.enum'

const tasks = ref<Task[]>([
  {
    deadline: '10-10-2010',
    title: 'New Amazing Task',
    id: 1,
    status: Status.ToDo,
  },
  {
    deadline: '10-10-2010',
    title: 'New Amazing Task',
    id: 1,
    status: Status.Completed,
  },
  {
    deadline: '10-10-2010',
    title: 'New Amazing Task',
    id: 1,
    status: Status.InProgress,
  },
  {
    deadline: '10-10-2010',
    title: 'New Amazing Task',
    id: 1,
    status: Status.ToDo,
  },
  {
    deadline: '10-10-2010',
    title: 'New Amazing Task',
    id: 1,
    status: Status.ToDo,
  },
])

// const handelAddingNewTask = (data: string) => {
//   tasks.value.unshift({
//     content: data,
//     subtitle: '10-10-2010',
//     title: 'New Amazing Task',
//     id: Math.random() + Math.random(),
//   })
// }
const handleDeleteTask = (id: number) => {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}

const taskStatuses = [
  { key: Status.ToDo, label: 'To Do', bgColor: 'bg-yellow-100' },
  { key: Status.InProgress, label: 'In Progress', bgColor: 'bg-blue-100' },
  { key: 'approval', label: 'On Approval', bgColor: 'bg-green-100' },
  { key: Status.Completed, label: 'Done', bgColor: 'bg-pink-100' },
]

// Filter tasks by status
const filteredTasks = (status: string) => tasks.value.filter((task) => task.status === status)
</script>
