<template>
  <div class="card flex justify-center place-items-center py-40">
    <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
  </div>
</template>

<script setup lang="ts">
import Chart from 'primevue/chart'
import { ref, computed } from 'vue'
import { useTasksStore } from '../stores/tasks.store'
import { useQuery } from '@tanstack/vue-query'
import type { Task } from '../models/task.type'
import { Status } from '../models/status.enum'

const chartData = ref({})
const chartOptions = ref({})

const tasksStore = useTasksStore()
const { data: tasks, isLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: tasksStore.fetchTasks,
})

const computedChartData = computed(() => {
  if (isLoading.value || !tasks.value) {
    return {
      labels: [],
      datasets: [],
    }
  }

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

chartData.value = computedChartData.value

chartOptions.value = (() => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  }
})()
</script>
