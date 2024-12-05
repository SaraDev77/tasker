<template>
  <div class="min-h-screen w-full bg-sky-100 flex justify-center place-items-center">
    <Form @submit="login" >
      <div class="flex flex-col gap-2 bg-slate-50 rounded-lg p-10 w-96">
        <h2 class="font-bold text-xl text-slate-950 mb-4 text-center">
          <i class="pi pi-sign-in pr-2 text-sky-400"></i>Tasker Login
        </h2>
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <label for="email" :class="labelStyle">Email</label>
            <Field name="email" :class="fieldStyle" v-model="formInputs.email"  />
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
            Login
          </Button>
        </div>
      </div>
    </Form>
    <Toast />
  </div>
</template>

<script lang="ts" setup>
import { Button, Toast, useToast } from 'primevue'
import { Field, Form, ErrorMessage } from 'vee-validate'
import type { formData } from '../../models/auth.model'
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { loginSchema } from '../../schemas/login-form.schema'

const formInputs = ref<formData>({ email: '', password: '' })
const authStore = useAuthStore()
const toast = useToast()

const showErrToast = (message: string) => {
  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: message,
    life: 3000,
  })
}

const login = async () => {
  try {
    const parsedData = loginSchema.safeParse(formInputs.value)
    if (parsedData.success) {
      await authStore.login(formInputs.value)
    } else {
      const errorDetails = parsedData.error.errors.map((err) => err.message).join(', ')
      showErrToast(`Validation Error: ${errorDetails}`)
    }
  } catch (err) {
    console.error('Login Error:', err)
    showErrToast('An unexpected error occurred during login.')
  }
}

const fieldStyle = 'w-full h-14 border border-slate-200 p-4  block rounded-md'
const labelStyle = 'text-gray-800 text-lg my-2'
const errorStyle = 'text-red-500 text-sm'
</script>
