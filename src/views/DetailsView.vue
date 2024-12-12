<template>
  <div v-if="isLoading" class="min-h-full min-w-full flex justify-center place-items-center">
    <LoaderComponent />
  </div>
  <Fieldset legend="Task Details" v-else class="!bg-sky-50 !py-2 !m-4">
    <div class="min-h-full min-w-full flex flex-col justify-center">
      <SplitComponent v-for="(value, key) in data" :key="key">
        <template #title>
          <h1>{{ key }}</h1>
        </template>
        <template #data>
          <h1>{{ value }}</h1>
        </template>
      </SplitComponent>
    </div></Fieldset
  >
</template>
<script lang="ts" setup>
import { useTasksStore } from '../stores/tasks.store'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import LoaderComponent from '../components/loader/LoaderComponent.vue'
import SplitComponent from '../components/SplitComponent.vue'
import type { Task } from '../models/task.type'
import { formatStatus } from '../utils/format-status.util'
import { Fieldset } from 'primevue'

const route = useRoute()
const taskId = route.params.id
const taskStore = useTasksStore()

const { data, isLoading } = useQuery({
  queryKey: ['tasks', taskId],
  queryFn: () => taskStore.fetchSingleTask(String(taskId)),
  select: (data: Task) => {
    return {
      Title: data.title,
      Status: formatStatus(data.status!),
      Deadline: new Date(data.deadline!).toLocaleDateString('en-US'),
      Description: data.description,
    }
  },
})
</script>
