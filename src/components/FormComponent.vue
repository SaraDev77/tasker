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

      <div class="flex flex-col gap-2">
        <label for="deadline" :class="labelStyle">Deadline</label>
        <Field name="deadline">
          <!--This Err Doesn't really affect the app running it's resulted from the acceptance of the picker to dates only desn't get the initial value of the string of date format -->
          <DatePicker v-model="data.deadline" placeholder="select a deadline"></DatePicker>
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
        <Field
          name="description"
          :class="clsx(fieldStyle, '!h-24')"
          v-model="data.description"
        />

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
import { reactive } from 'vue'
import type { Task, TaskRequest } from '../models/task.type'
import { toTypedSchema } from '@vee-validate/zod'
import { Button, Toast } from 'primevue'
import DatePicker from 'primevue/datepicker'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useTasksStore } from '../stores/tasks'
import { addSchema } from '../schemas/add-form.schema'
import { editSchema } from '../schemas/edit-form.schema'
import clsx from 'clsx'
import { useAuthStore } from '../stores/auth'
import { showErrToast, showSuccessToast } from '../utils/show-toasts'

const queryClient = useQueryClient()
const tasksStore = useTasksStore()
const authStore=useAuthStore()
const props = defineProps<{
  initialData?: Partial<Task>
  mode: 'add' | 'edit'
  closeOverlay: () => void
}>()
const options = Object.values(Status)
const data = reactive<Task | TaskRequest>({
  _id: props.initialData?._id,
  title: props.initialData?.title || '',
  status: props.initialData?.status || Status.PENDING,
  deadline: '',
  description: props.initialData?.description || '',
  createdBy: {
    _id: props.initialData?.createdBy?._id || Date.now().toString(),
    email: props.initialData?.createdBy?.email || authStore.loggedUser,
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
    showSuccessToast('Form Submitted Successfully!')
    setTimeout(() => {
      props.closeOverlay()
    }, 2000)
  },
})

const validationSchema = toTypedSchema(props.mode === 'add' ? addSchema : editSchema)

const submitData = () => {
  const parsedData: TaskRequest = {
    ...data,
    deadline: new Date(data.deadline!),
  }
  const parsed = (props.mode === 'add' ? addSchema : editSchema).safeParse(parsedData)
  if (parsed.success) {
    mutate(parsedData)
  } else {
    showErrToast('Form Submittion Failed!')
    console.error(parsed.error)
  }
}

const fieldStyle = 'w-full h-14 border border-slate-200 p-4  block rounded-md'
const labelStyle = 'text-gray-800 text-lg my-2'
const errorStyle = 'text-red-500 text-sm'
</script>
