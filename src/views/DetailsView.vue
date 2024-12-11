<template>
  <div v-if="isLoading" class="min-h-full min-w-full flex justify-center place-items-center">
    <h1>Loading .....</h1>
  </div>
  <div v-else class="min-h-full min-w-full">
    <h1
      class="text-gray-700 xl:text-2xl lg:text-lg text-md font-bold flex justify-center align-middle place-items-center gap-2 my-5"
    >
      {{ 'Task Id No :' + data?._id }}
    </h1>
    <div class="flex justify-center">
      <div
        class="m-10 flex flex-col w-full min-h-full rounded-3xl p-10 border-2 border-sky-800 border-opacity-25 gap-8 bg-slate-200"
      >
        <div class="flex flex-wrap align-middle justify-center xl:gap-4 gap-2">
          <h1 class="xl:text-2xl lg:text-lg text-md text-gray-900 font-bold">Task Name :</h1>
          <h1 class="xl:text-2xl lg:text-lg text-md text-gray-900 font-bold">
            {{ data?.title }}
          </h1>
        </div>
        <div
          class="flex flex-col justify-center align-middle place-items-center xl:gap-4 gap-2"
          v-if="data?.deadline"
        >
          <h1 class="xl:text-2xl lg:text-lg text-md text-gray-900 font-bold">Task Deadline :</h1>
          <h1 class="xl:text-2xl lg:text-lg text-md text-red-900 font-bold">
            {{ data?.deadline?.toString().split('T')[0] }}
          </h1>
        </div>
        <div class="flex justify-center align-middle place-items-center xl:gap-4 gap-2">
          <h1 class="xl:text-2xl lg:text-lg text-md text-gray-900 font-bold">Task Status :</h1>
          <h1 class="xl:text-2xl lg:text-lg text-md text-gray-900 font-bold">
            {{
              data.status.charAt(0).toUpperCase() +
              data.status.slice(1).toLowerCase().replace('_', ' ')
            }}
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useTasksStore } from '../stores/tasks.store'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'

const route = useRoute()
const taskId = route.params.id
const taskStore = useTasksStore()

const { data, isLoading } = useQuery({
  queryKey: ['tasks', taskId],
  queryFn: () => {
    return taskStore.fetchSingleTask(String(taskId))
  },
})

</script>
