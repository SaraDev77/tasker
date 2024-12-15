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
      <Field
        name="title"
        class="w-full h-14 border border-slate-200 p-4 block rounded-md"
        v-model="title"
        v-bind="titleAttrs"
      />
      <p class="text-red-500 text-sm">{{ errors.title }}</p>
    </template>
    <template #deadline>
      <Field name="deadline">
        <DatePicker
          v-model="formData.deadline"
          placeholder="select a deadline"
          :min-date="today"
        ></DatePicker>
      </Field>
      <ErrorMessage name="deadline" class="text-red-500 text-sm" />
    </template>
    <template #description>
      <Field
        name="description"
        class="w-full border border-slate-200 p-4 block rounded-md !h-24"
        v-model="description"
        v-bind="descriptionAttrs"
      />
      <p class="text-red-500 text-sm">{{ errors.description }}</p>
    </template>
  </FormComponent>
</template>

<script lang="ts" setup>
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue'
import DatePicker from 'primevue/datepicker'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import type { Task, TaskRequest } from '../../models/task.type'
import { editSchema } from '../../schemas/editForm.schema'
import { showErrToast, showSuccessToast } from '../../utils/showToasts.util'
import FormComponent from './FormComponent.vue'
import { toTypedSchema } from '@vee-validate/zod'
import { taskService } from '../../utils/tasksRequests.util'

const queryClient = useQueryClient()
const toast = useToast()
const today = new Date()
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
const { errors, defineField, setFieldError } = useForm({
  validationSchema: toTypedSchema(editSchema),
  initialValues: formData.value,
})
const [title, titleAttrs] = defineField('title')
const [description, descriptionAttrs] = defineField('description')

watch(title, (newValue) => {
  formData.value.title = newValue!
})
watch(description, (newValue) => {
  formData.value.description = newValue
})

const { mutate } = useMutation({
  mutationFn: (task: Task) => {
    taskService.updateTask(task, props.initialData?._id)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    showSuccessToast(toast, 'Form Submitted Successfully!')
    setTimeout(() => {
      props.closeOverlay()
    }, 1000)
  },
})

const submitData = () => {
  const parsed = editSchema.safeParse(formData.value)
  if (parsed.success) {
    mutate(formData.value)
  } else {
    parsed.error.issues.forEach((issue) => {
      const field = issue.path.join('.') as keyof typeof formData.value
      if (field === 'title' || field === 'description' || field === 'status') {
        setFieldError(field, issue.message)
      }
    })
    showErrToast(toast, 'Recheck Your Entered Data ,Please!')
  }
}
</script>
