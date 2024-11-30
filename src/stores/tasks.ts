import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { TaskRequest } from '../models/task.type'
import { Status } from '../models/status.enum'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([
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
  function addTask(data: TaskRequest) {
    console.log(data)
  }

  return { tasks, addTask }
})

// const count = ref(0)
// const doubleCount = computed(() => count.value * 2)
// function increment() {
//   count.value++
// }

// return { count, doubleCount, increment }
