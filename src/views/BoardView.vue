<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import BoardComponent from '../components/BoardComponent.vue'
import CardComponent from '../components/CardComponent.vue'
import type { Task } from '../models/task.type'
import { useTasksStore } from '../stores/tasks.store'
import { Status } from '../models/status.enum'
import { computed } from 'vue'
import LoaderComponent from '../components/loader/LoaderComponent.vue'

const tasksStore = useTasksStore()

const { data ,isLoading} = useQuery({
  queryKey: ['tasks'],
  queryFn: tasksStore.fetchTasks,
  select: (data: Task[]) => {
    const categorizedTasks: {
      pendingTasks: Task[]
      inProgressTasks: Task[]
      doneTasks: Task[]
    } = {
      pendingTasks: [],
      inProgressTasks: [],
      doneTasks: [],
    }
    data.forEach((task) => {
      if (task.status === Status.PENDING) {
        categorizedTasks.pendingTasks.push(task)
      } else if (task.status === Status.IN_PROGRESS) {
        categorizedTasks.inProgressTasks.push(task)
      } else if (task.status === Status.COMPLETED) {
        categorizedTasks.doneTasks.push(task)
      }
    })
    return categorizedTasks
  },
})

const boardsData = computed(() => {
  const tasks = data.value || {
    pendingTasks: [],
    inProgressTasks: [],
    doneTasks: [],
  }

  return [
    { title: "Pending Tasks", bgColor: "!bg-sky-100", tasks: tasks.pendingTasks },
    { title: "In Progress Tasks", bgColor: "!bg-yellow-100", tasks: tasks.inProgressTasks },
    { title: "Done Tasks", bgColor: "!bg-green-300", tasks: tasks.doneTasks },
  ]
})
</script>

<template>
    <div v-if="isLoading" class="min-h-full min-w-full flex justify-center place-items-center">
    <LoaderComponent />
  </div>
  <div v-else class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
    <BoardComponent
      v-for="(board, index) in boardsData"
      :key="index"
      :title="board.title"
      :bg-color="board.bgColor"
      :count="board.tasks.length"
    >
      <template #cards>
        <div class="space-y-4">
          <CardComponent
            v-for="task in board.tasks"
            :key="task._id"
            :task="task"
            :showActions="false"
          />
        </div>
      </template>
    </BoardComponent>
  </div>
</template>
