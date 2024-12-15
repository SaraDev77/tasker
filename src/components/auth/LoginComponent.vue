<template>
  <div class="min-h-screen w-full bg-sky-100 flex flex-col justify-center place-items-center">
    <Form @submit="userLogin" :validation-schema="validationSchema">
      <div class="flex flex-col gap-2 bg-slate-50 rounded-lg p-10 w-96">
        <h2 class="font-bold text-xl text-slate-950 mb-4 text-center">
          <i class="pi pi-sign-in pr-2 text-sky-400"></i>
          Tasker Login
        </h2>
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <label for="email" class="text-gray-800 text-lg my-2">Email</label>
            <Field
              name="email"
              class="w-full h-14 border border-slate-200 p-4 block rounded-md"
              v-model="email"
              v-bind="emailAttrs"
            />
            <p class="text-red-500 text-sm">{{ errors.email }}</p>
          </div>
          <div class="flex flex-col gap-2">
            <label for="password" class="text-gray-800 text-lg my-2">Password</label>
            <Field
              name="password"
              class="w-full h-14 border border-slate-200 p-4 block rounded-md"
              type="password"
              v-model="password"
              v-bind="passwordAttrs"
            />
            <p class="text-red-500 text-sm">{{ errors.password }}</p>
          </div>
          <Button
            class="!rounded-md !bg-sky-600 !border-none hover:!bg-sky-500"
            type="submit"
            @click="userLogin"
          >
            login
          </Button>
        </div>
      </div>
    </Form>
    <span class="mt-4 text-lg text-sky-600"><RouterLink to="/register">Sign Up</RouterLink></span>

    <ToastComponent />
  </div>
</template>

<script lang="ts" setup>
import { Button, useToast } from 'primevue'
import { Field, Form, useForm } from 'vee-validate'
import type { formData } from '../../models/auth.model'
import { ref, watch } from 'vue'
import { showErrToast } from '../../utils/showToasts.util'
import { useAuthStore } from '../../stores/auth.store'
import { authSchema } from '../../schemas/authForm.schema'
import { toTypedSchema } from '@vee-validate/zod'

const formInputs = ref<formData>({ email: '', password: '' })
const toast = useToast()
const authStore = useAuthStore()
const validationSchema = toTypedSchema(authSchema)

const { errors, defineField, setFieldError } = useForm({
  validationSchema: toTypedSchema(authSchema),
  initialValues: formInputs.value,
})
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

watch(email, (newValue) => {
  formInputs.value.email = newValue!
})
watch(password, (newValue) => {
  formInputs.value.password = newValue!
})

const userLogin = async () => {
  try {
    const parsedData = authSchema.safeParse(formInputs.value)
    if (parsedData.success) {
      await authStore.login(formInputs.value)
    } else {
      parsedData.error.issues.forEach((issue) => {
        const field = issue.path.join('.') as keyof typeof formInputs.value
        setFieldError(field, issue.message)
      })
      const errorDetails = parsedData.error.issues.map((err) => err.message).join(', ')
      showErrToast(toast, `Validation Error: ${errorDetails}`)
    }
  } catch (err: unknown) {
  if (err && typeof err === 'object' && 'response' in err) {
    const responseErr = err as { response: { data: { message: string } } }; 
    showErrToast(toast, responseErr.response.data.message);
  } else {
    showErrToast(toast, 'Unexpected error occurred.');
  }
  }}
</script>
