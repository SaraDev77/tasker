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
        <Field name="deadline" v-slot="{ field }">
          <DatePicker
            v-bind="field"
            v-model="field.value"
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
          <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
        </Field>
        <ErrorMessage name="status" :class="errorStyle" />
      </div>

      <div class="flex flex-col gap-2">
        <label for="description" :class="labelStyle">Task Description</label>
        <Field name="description" :class="[fieldStyle, '!h-24']" v-model="data.description" />

        <ErrorMessage name="description" :class="errorStyle" />
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <Button class="!rounded-md !bg-sky-600 !border-none hover:!bg-sky-500" type="submit"
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
import type { TaskRequest } from '../models/task.type'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Button, DatePicker, Toast } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { useMutation } from '@tanstack/vue-query'
import { useTasksStore } from '../stores/tasks'

const tasksStore = useTasksStore()
const props = defineProps<{
  initialData?: Partial<TaskRequest>
  mode: 'add' | 'edit'
  closeOverlay: () => void
}>()

const date = Date.now()
const options = Object.values(Status)
const data = reactive<TaskRequest>({
  title: props.initialData?.title || '',
  deadline: props.initialData?.deadline || new Date(date).toISOString().split('T')[0],
  status: props.initialData?.status || Status.PENDING,
  description: props.initialData?.description || '',
  createdBy: {
    _id: props.initialData?.createdBy?._id || 'sara@bright.com',
    email: props.initialData?.createdBy?.email || '27',
  },
})
const { mutate } = useMutation({
  mutationFn: tasksStore.createTask,
  onError: () => {
    showErrToast()
  },
  onSuccess: () => {
    showSuccessToast()
    setTimeout(() => {
      props.closeOverlay()
    }, 2000)
  },
})

const schema = z.object({
  title: z.string().min(1, 'Task is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  deadline: z
    .union([
      z
        .string()
        .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(new Date(value).getTime()), {
          message: 'Invalid date format or value. Use YYYY-MM-DD.',
        }),
      z.date(),
    ])
    .transform((value) => (value instanceof Date ? value.toISOString().split('T')[0] : value)),
  status: z.string().min(1, 'Status is required'),
})
const validationSchema = toTypedSchema(schema)
const toast = useToast()

const showErrToast = () => {
  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: 'Validation Failed cannot Submit!',
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

  const parsed = schema.safeParse(data);

  if (parsed.success) {
    mutate(data);
  } else {
    showErrToast();
    console.error(parsed.error);
  }
};

const fieldStyle = 'w-full h-14 border border-slate-200 p-4  block rounded-md'
const labelStyle = 'text-gray-800 text-lg my-2'
const errorStyle = 'text-red-500 text-sm'
</script>
