<template>
  <div class="min-h-screen w-full bg-sky-100 flex flex-col justify-center place-items-center">
    <Form @submit="userRegister" :validation-schema="validationSchema">
      <div class="flex flex-col gap-2 bg-slate-50 rounded-lg p-10 w-96">
        <h2 class="font-bold text-xl text-slate-950 mb-4 text-center">
          <i class="pi pi-sign-in pr-2 text-sky-400"></i>
          Tasker Register
        </h2>
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <label for="email" :class="labelStyle">Email</label>
            <Field name="email" :class="fieldStyle" v-model="formInputs.email" />
            <ErrorMessage name="email" :class="errorStyle" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="password" :class="labelStyle">Password</label>
            <Field
              name="password"
              :class="fieldStyle"
              type="password"
              v-model="formInputs.password"
            />
            <ErrorMessage name="password" :class="errorStyle" />
          </div>
          <Button class="!rounded-md !bg-sky-600 !border-none hover:!bg-sky-500" type="submit">
            Sign up
          </Button>
        </div>
      </div>
    </Form>
    <span class="mt-4 text-lg text-sky-600"><RouterLink to="/login">Login</RouterLink></span>

    <ToastComponent />
  </div>
</template>

<script lang="ts" setup>
import { Button, useToast } from 'primevue'
import { Field, Form, ErrorMessage } from 'vee-validate'
import type { formData } from '../../models/auth.model'
import { ref } from 'vue'
import { showErrToast } from '../../utils/show-toasts.util'
import { useAuthStore } from '../../stores/auth.store'
import { authSchema } from '../../schemas/auth-form.schema'
import { toTypedSchema } from '@vee-validate/zod'

const formInputs = ref<formData>({ email: '', password: '' })
const toast = useToast()
const authStore = useAuthStore()
const validationSchema = toTypedSchema(authSchema)

const userRegister = async () => {
  try {
    const parsedData = authSchema.safeParse(formInputs.value)
    if (!parsedData.success) {
      const errorDetails = parsedData.error.errors.map((err) => err.message).join(', ')
      return showErrToast(toast, `Validation Error: ${errorDetails}`)
    }
    await authStore.register(formInputs.value)
  } catch (err) {
    console.error('Authentication Error:', err)
    showErrToast(toast, 'An unexpected error occurred during submission.')
  }
}

const fieldStyle = 'w-full h-14 border border-slate-200 p-4  block rounded-md'
const labelStyle = 'text-gray-800 text-lg my-2'
const errorStyle = 'text-red-500 text-sm'
</script>
