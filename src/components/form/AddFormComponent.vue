<template>
  <FormComponent
    :submit-data="submitData"
    :close-overlay="closeOverlay"
    :validation-schema="addSchema"
  >
    <template #formTitle>
      <h1 class="font-bold text-xl text-slate-950 mb-4">Add New Task</h1>
    </template>
    <template #title>
      <Field
        name="title"
        class="w-full h-14 border border-slate-200 p-4 block rounded-md"
        v-model="title"
        v-bind="titleAttrs"
      />
      <p class="!text-red-500 !text-sm">{{ errors.title }}</p>
    </template>
    <template #deadline>
      <Field name="deadline">
        <DatePicker
          v-model="deadline"
          v-bind="deadlineAttrs"
          placeholder="select a deadline"
          :min-date="today"
        ></DatePicker>
      </Field>
      <p class="!text-red-500 !text-sm">{{ errors.deadline }}</p>
    </template>
    <template #status>
      <div class="flex flex-col gap-2">
        <label for="status" class="text-gray-800 text-lg my-2">Status</label>
        <Field
          name="status"
          as="select"
          class="w-full h-14 border border-slate-200 p-4 block rounded-md"
          v-model="status"
          v-bind="statusAttrs"
        >
          <option v-for="option in statusOptions" :key="option" :value="option">
            {{ formatStatus(option) }}
          </option>
        </Field>
        <p class="!text-red-500 !text-sm">{{ errors.status }}</p>
      </div>
    </template>
    <template #description>
      <Field
        name="description"
        :class="clsx('w-full h-14 border border-slate-200 p-4  block rounded-md', '!h-24')"
        v-model="description"
        v-bind="descriptionAttrs"
      />
      <p class="!text-red-500 !text-sm">{{ errors.description }}</p>
    </template>
  </FormComponent>
</template>

<script lang="ts" setup>
import { Status } from '@/models/status.enum'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import clsx from 'clsx'
import { useToast } from 'primevue'
import DatePicker from 'primevue/datepicker'
import { Field, useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import type { Task, TaskRequest } from '../../models/task.type'
import { showErrToast, showSuccessToast } from '../../utils/showToasts.util'
import FormComponent from './FormComponent.vue'
import { addSchema } from '../../schemas/addForm.schema'
import { formatStatus } from '../../utils/formatStatus.util'
import { toTypedSchema } from '@vee-validate/zod'
import { taskService } from '../../utils/tasksRequests.util'

const queryClient = useQueryClient()
const statusOptions = Object.values(Status)
const props = defineProps<{
  closeOverlay: () => void
}>()
const formData = ref<TaskRequest>({ title: '' })
const toast = useToast()
const today = new Date()
const { errors, defineField, setFieldError } = useForm({
  validationSchema: toTypedSchema(addSchema),
  initialValues: formData.value,
})
const [title, titleAttrs] = defineField('title')
const [description, descriptionAttrs] = defineField('description')
const [status, statusAttrs] = defineField('status')
const [deadline, deadlineAttrs] = defineField('deadline')

watch(title, (newValue) => {
  formData.value.title = newValue!
})
watch(description, (newValue) => {
  formData.value.description = newValue
})
watch(status, (newValue) => {
  formData.value.status = newValue as Status
})
watch(deadline as unknown as Date, (newValue: Date) => {
  formData.value.deadline = newValue
})

const { mutate } = useMutation({
  mutationFn: (task: Task) => {
    taskService.createTask(task)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    showSuccessToast(toast, 'Form Submitted Successfully, Your Task Is Added Yay!')
    setTimeout(() => {
      props.closeOverlay()
    }, 1000)
  },
})

const submitData = () => {
  const parsed = addSchema.safeParse(formData.value)
  if (parsed.success) {
    mutate(formData.value)
  } else {
    parsed.error.issues.forEach((issue) => {
      const field = issue.path.join('.') as keyof typeof formData.value
      if (
        field === 'title' ||
        field === 'description' ||
        field === 'status' ||
        field === 'deadline'
      ) {
        setFieldError(field, issue.message)
      }
    })
    showErrToast(toast, 'Recheck Your Entered Data,Please!')
    console.error(parsed.error)
  }
}
</script>
