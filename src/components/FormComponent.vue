<template>
  <Form :validation-schema="validationSchema" @submit="submitData">
    <h1 v-if="mode === 'add'" class="font-bold text-xl text-slate-950 mb-4">Add New Task</h1>
    <h1 v-else class="font-bold text-xl text-slate-950 mb-4">Edit Task</h1>

    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-2">
        <label for="title" :class="labelStyle">Title</label>
        <Field name="title" :class="fieldStyle" v-model="formData.title" />
        <ErrorMessage name="title" :class="errorStyle" />
        <hr />
      </div>

      <div class="flex flex-col gap-2">
        <label for="deadline" :class="labelStyle">Deadline</label>
        <Field name="deadline">
          <!--This Err Doesn't really affect the app running it's resulted from the acceptance of the picker to dates only desn't get the initial value of the string of date format -->
          <DatePicker v-model="formData.deadline" placeholder="select a deadline"></DatePicker>
        </Field>
        <ErrorMessage name="deadline" :class="errorStyle" />
        <hr />
      </div>

      <div class="flex flex-col gap-2">
        <label for="status" :class="labelStyle">Status</label>
        <Field name="status" as="select" :class="fieldStyle" v-model="formData.status">
          <option v-for="option in statusOptions" :key="option" :value="option">
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
          v-model="formData.description"
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
  <ToastComponent />
</template>

<script lang="ts" setup>
import { Status } from '@/models/status.enum'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import clsx from 'clsx'
import { Button, useToast } from 'primevue'
import DatePicker from 'primevue/datepicker'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { reactive } from 'vue'
import type { Task, TaskRequest } from '../models/task.type'
import { addSchema } from '../schemas/add-form.schema'
import { editSchema } from '../schemas/edit-form.schema'
import { useTasksStore } from '../stores/tasks'
import { showErrToast, showSuccessToast } from '../utils/show-toasts'

const queryClient = useQueryClient()
const tasksStore = useTasksStore()
const props = defineProps<{
  initialData?: Partial<Task>
  mode: 'add' | 'edit'
  closeOverlay: () => void
}>()
const statusOptions = Object.values(Status)

const formData = reactive<TaskRequest>({
  title: props.initialData?.title || '',
  status: props.initialData?.status || Status.PENDING,
  deadline: '',
  description: props.initialData?.description || '',
})
const toast = useToast()

const { mutate } = useMutation({
  mutationFn: (task: Task) => {
    if (props.mode === 'add') {
      return tasksStore.createTask(task)
    } else {
      return tasksStore.updateTask(task, props.initialData?._id)
    }
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })

    showSuccessToast(toast, 'Form Submitted Successfully!')
    setTimeout(() => {
      props.closeOverlay()
    }, 2000)
  },
})

const validationSchema = toTypedSchema(props.mode === 'add' ? addSchema : editSchema)

const submitData = () => {
  const parsedData: TaskRequest = {
    ...formData,
    deadline: new Date(formData.deadline!),
  }
  const parsed = (props.mode === 'add' ? addSchema : editSchema).safeParse(parsedData)
  if (parsed.success) {
    mutate(parsedData)
  } else {
    showErrToast(toast, 'Form Submittion Failed!')
    console.error(parsed.error)
  }
}

const fieldStyle = 'w-full h-14 border border-slate-200 p-4  block rounded-md'
const labelStyle = 'text-gray-800 text-lg my-2'
const errorStyle = 'text-red-500 text-sm'
</script>
