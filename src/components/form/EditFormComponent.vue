<template>
  <FormComponent
    :submit-data="submitData"
    :close-overlay="closeOverlay"
    :validation-schema="editSchema"
  >
    <template #formTitle>
      <h1 class="font-bold text-xl text-slate-950 mb-4">Edit Task</h1>
    </template>
    <template #title>
      <Field name="title" :class="fieldStyle" v-model="formData.title" />
      <ErrorMessage name="title" />
    </template>
    <template #deadline>
      <Field name="deadline">
        <DatePicker v-model="formData.deadline" placeholder="select a deadline"></DatePicker>
      </Field>
      <ErrorMessage name="deadline" :class="errorStyle" />
    </template>
    <template #status>
      <Field name="status" as="select" :class="fieldStyle" v-model="formData.status">
        <option v-for="option in statusOptions" :key="option" :value="option">
          {{ formatStatus(option) }}
        </option>
      </Field>
      <ErrorMessage name="status" :class="errorStyle" />
    </template>
    <template #description>
      <Field name="description" :class="clsx(fieldStyle, '!h-24')" v-model="formData.description" />
      <ErrorMessage name="description" :class="errorStyle" />
    </template>
  </FormComponent>
</template>

<script lang="ts" setup>
import { Status } from '@/models/status.enum'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import clsx from 'clsx'
import { useToast } from 'primevue'
import DatePicker from 'primevue/datepicker'
import { ErrorMessage, Field } from 'vee-validate'
import { ref } from 'vue'
import type { Task, TaskRequest } from '../../models/task.type'
import { editSchema } from '../../schemas/edit-form.schema'
import { useTasksStore } from '../../stores/tasks.store'
import { showErrToast, showSuccessToast } from '../../utils/show-toasts.util'
import FormComponent from './FormComponent.vue'
import { formatStatus } from '../../utils/format-status.util'

const queryClient = useQueryClient()
const tasksStore = useTasksStore()
const statusOptions = Object.values(Status)
const props = defineProps<{
  initialData: Task
  closeOverlay: () => void
}>()
const formData = ref<TaskRequest>({
  title: props.initialData?.title,
  status: props.initialData?.status,
  deadline: props.initialData?.deadline,
  description: props.initialData?.description,
})
const parsed = editSchema.safeParse(formData.value)
const toast = useToast()

const { mutate } = useMutation({
  mutationFn: (task: Task) => {
    tasksStore.updateTask(task, props.initialData?._id)
  },
  onSettled: () => {
    queryClient.invalidateQueries('tasks')
  },
  onSuccess: () => {
    queryClient.invalidateQueries('tasks')
    showSuccessToast(toast, 'Form Submitted Successfully!')
    setTimeout(() => {
      props.closeOverlay()
    }, 2000)
  },
})

const submitData = () => {
  if (parsed.success) {
    mutate(formData.value)
  } else {
    showErrToast(toast, 'Form Submittion Failed!')
    console.error((parsed.error.name = 'title'))
  }
}

const fieldStyle = 'w-full h-14 border border-slate-200 p-4  block rounded-md'
const errorStyle = 'text-red-500 text-sm'
</script>
