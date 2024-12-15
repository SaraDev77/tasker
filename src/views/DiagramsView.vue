<template>
  <div v-if="isLoading" class="min-h-full min-w-full flex justify-center place-items-center">
    <LoaderComponent />
  </div>
  <div v-else class="card flex flex-col justify-center place-items-center py-40 space-y-10 h-full">
    <h3 class="text-xl text-gray-900 font-semibold">Tasks Statistics</h3>
    <Splitter class="mb-8 !h-full !w-full" layout="horizontal">
      <SplitterPanel class="flex items-center justify-center">
        <Chart
          v-if="chartData.labels?.length"
          type="pie"
          :data="chartData"
          :options="chartOptions"
        />
      </SplitterPanel>
      <SplitterPanel class="flex items-center justify-center">
        <Chart
          v-if="barChartData.labels?.length"
          type="bar"
          :data="barChartData"
          :options="barChartOptions"
        />
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import Chart from 'primevue/chart'
import LoaderComponent from '../components/loader/LoaderComponent.vue'
import type { Task } from '../models/task.type'
import { Status } from '../models/status.enum'
import { Splitter, SplitterPanel } from 'primevue'
import { taskService } from '../utils/tasksRequests.util'

interface Dataset {
  label: string
  data: number[]
  backgroundColor: string[]
  hoverBackgroundColor?: string[]
}

interface ChartData {
  labels: string[]
  datasets: Dataset[]
}

const chartData = ref<ChartData>({
  labels: [],
  datasets: [],
})

const barChartData = ref<ChartData>({
  labels: [],
  datasets: [],
})

const chartOptions = ref({})
const barChartOptions = ref({})

const { data: tasks, isLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: taskService.fetchTasks,
})

const computedChartData = computed(() => {
  if (isLoading.value || !tasks.value) return { labels: [], datasets: [] }
  const completedTasks = tasks.value.filter((task: Task) => task.status === Status.COMPLETED).length
  const undoneTasks = tasks.value.length - completedTasks
  const documentStyle = getComputedStyle(document.body)
  return {
    labels: ['Completed', 'Undone'],
    datasets: [
      {
        label: 'Task Status Distribution',
        data: [completedTasks, undoneTasks],
        backgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-500'),
          documentStyle.getPropertyValue('--p-orange-500'),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-400'),
          documentStyle.getPropertyValue('--p-orange-400'),
        ],
      },
    ],
  }
})

const computedBarChartData = computed(() => {
  if (isLoading.value || !tasks.value) return { labels: [], datasets: [] }
  const taskTypes = ['To Do', 'In Progress', 'Completed']
  const taskCounts = [
    tasks.value.filter((task: Task) => task.status === Status.PENDING).length,
    tasks.value.filter((task: Task) => task.status === Status.IN_PROGRESS).length,
    tasks.value.filter((task: Task) => task.status === Status.COMPLETED).length,
  ]

  const documentStyle = getComputedStyle(document.body)
  return {
    labels: taskTypes,
    datasets: [
      {
        label: 'Tasks',
        backgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-500'),
          documentStyle.getPropertyValue('--p-gray-500'),
          documentStyle.getPropertyValue('--p-orange-500'),
        ],
        data: taskCounts,
      },
    ],
  }
})

watch(
  computedChartData,
  (newData) => {
    chartData.value = newData
  },
  { immediate: true },
)

watch(
  computedBarChartData,
  (newData) => {
    barChartData.value = newData
  },
  { immediate: true },
)

const documentStyle = getComputedStyle(document.documentElement)
const textColor = documentStyle.getPropertyValue('--p-text-color')

chartOptions.value = {
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
        color: textColor,
      },
    },
  },
}

barChartOptions.value = {
  maintainAspectRatio: false,
  aspectRatio: 0.8,
  plugins: {
    legend: {
      labels: {
        color: textColor,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: textColor,
      },
      grid: {
        color: documentStyle.getPropertyValue('--p-content-border-color'),
      },
    },
    y: {
      ticks: {
        color: textColor,
      },
      grid: {
        color: documentStyle.getPropertyValue('--p-content-border-color'),
      },
    },
  },
}
</script>
