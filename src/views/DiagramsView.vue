<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
    <p v-if="isLoading">Loading tasks...</p>
    <p v-if="isError">Error loading tasks.</p>
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import type { Task } from '../models/task.type'
import { Status } from '../models/status.enum'

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const tasksStore = useTasksStore()

const {
  data: tasks,
  isLoading,
  isError,
} = useQuery({
  queryKey: ['todos'],
  queryFn: tasksStore.fetchTasks,
  select: (data: Task[]) => data || [],
})

const chartData = computed(() => {
  if (isLoading || !tasks.value) {
    return {
      labels: [],
      datasets: [],
    }
  }

  const completedTasks = tasks.value.filter((task: Task) => task.status === Status.COMPLETED).length
  const undoneTasks = tasks.value.length - completedTasks

  return {
    labels: ['Completed', 'Undone'],
    datasets: [
      {
        label: 'Task Status Distribution',
        data: [completedTasks, undoneTasks],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  }
})

onMounted(() => {
  if (chartCanvas.value) {
    chartInstance = new Chart(chartCanvas.value, {
      type: 'bar',
      data: chartData.value,
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
        scales: {
          x: {
            title: { display: true, text: 'Task Status' },
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Number of Tasks' },
          },
        },
      },
    })
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>
