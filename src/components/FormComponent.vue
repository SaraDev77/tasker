<template>
  <Form :validation-schema="validationSchema" @submit="submitData">
    <h1 v-if="mode === 'add'" class="font-bold text-xl text-slate-950 mb-4">Add New Task</h1>
    <h1 v-else class="font-bold text-xl text-slate-950 mb-4">Edit Task</h1>

    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-2">
        <label for="title" :class="labelStyle">Title</label>
        <Field name="title" :class="fieldStyle" v-model="data.title" />
        <ErrorMessage name="title" :class="errorStyle" />
        <hr />
      </div>

      <div class="flex flex-col gap-2" v-if="props.mode === 'add'">
        <label for="deadline" :class="labelStyle">Deadline</label>
        <Field name="deadline" v-slot="{ field }">
          <DatePicker
            v-bind="field"
            v-model="dueDate"
            id="deadline"
            class="w-full border-2 rounded-md p-2"
            placeholder="Select a date"
          />
        </Field>
        <ErrorMessage name="deadline" :class="errorStyle" />
        <hr />
      </div>

      <div class="flex flex-col gap-2">
        <label for="status" :class="labelStyle">Status</label>
        <Field name="status" as="select" :class="fieldStyle" v-model="data.status">
          <option v-for="option in options" :key="option" :value="option">
            {{ option.charAt(0).toUpperCase() + option.slice(1).toLowerCase().replace('_', ' ') }}
          </option>
        </Field>
        <ErrorMessage name="status" :class="errorStyle" />
      </div>

      <div class="flex flex-col gap-2">
        <label for="description" :class="labelStyle">Task Description</label>
        <Field name="description" :class="[fieldStyle, '!h-24']" v-model="data.description" />

        <ErrorMessage name="description" :class="errorStyle" />
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <Button class="!rounded-md !bg-sky-600 !border-none hover:!bg-sky-500" @click="submitData"
          >Submit</Button
        >
        <Button class="!rounded-md !bg-red-600 !border-none hover:!bg-red-500" @click="closeOverlay"
          >Close</Button
        >
      </div>
    </div>
  </Form>
  <Toast />
</template>

<script lang="ts" setup>
import { Field, Form, ErrorMessage } from 'vee-validate'
import { Status } from '@/models/status.enum'
import { reactive, ref } from 'vue'
import type { Task, TaskRequest } from '../models/task.type'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Button, DatePicker, Toast } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useTasksStore } from '../stores/tasks'
import { formateDate } from '../utils/date-formatter'

const queryClient = useQueryClient()
const tasksStore = useTasksStore()
const props = defineProps<{
  initialData?: Partial<Task>
  mode: 'add' | 'edit'
  closeOverlay: () => void
}>()

const dueDate = ref()
const options = Object.values(Status)
const data = reactive<Task | TaskRequest>({
  _id: props.initialData?._id,
  title: props.initialData?.title || '',
  deadline: props.initialData?.deadline ? formateDate(dueDate.value || new Date()) : '',
  status: props.initialData?.status || Status.PENDING,
  description: props.initialData?.description || '',
  createdBy: {
    _id: props.initialData?.createdBy?._id || 'sara@bright.com',
    email: props.initialData?.createdBy?.email || '27',
  },
})

const { mutate } = useMutation({
  mutationFn: (task: Task) => {
    if (props.mode === 'add') {
      return tasksStore.createTask(task)
    } else {
      return tasksStore.updateTask(task, props.initialData?._id)
    }
  },
  onSuccess: () => {
    if (props.mode === 'add') {
      queryClient.invalidateQueries(['tasks'])
    } else {
      queryClient.invalidateQueries(['todo'])
    }
    showSuccessToast()
    setTimeout(() => {
      props.closeOverlay()
    }, 2000)
  },
})

const addSchema = z.object({
  title: z.string().min(1, 'Task is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  deadline: z.union([z.string().transform((value) => new Date(value)), z.date()]),
  status: z.string().min(1, 'Status is required'),
})

const editSchema = z.object({
  title: z.string().min(1, 'Task is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  status: z.string().min(1, 'Status is required'),
})

const validationSchema = toTypedSchema(props.mode === 'add' ? addSchema : editSchema)
const toast = useToast()

const showErrToast = () => {
  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: 'An Error Occured could not Submit!',
    life: 3000,
  })
}
const showSuccessToast = () => {
  toast.add({
    severity: 'success',
    summary: 'Succeeded!',
    detail: 'Form Submitted Successfully!',
    life: 3000,
  })
}

const submitData = () => {
  const parsed = (props.mode === 'add' ? addSchema : editSchema).safeParse(data)
  if (parsed.success) {
    mutate(data)
  } else {
    showErrToast()
    console.error(parsed.error)
  }
}

const fieldStyle = 'w-full h-14 border border-slate-200 p-4  block rounded-md'
const labelStyle = 'text-gray-800 text-lg my-2'
const errorStyle = 'text-red-500 text-sm'
</script>
