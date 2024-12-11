<template>
  <div class="min-h-screen w-full bg-sky-100 flex flex-col justify-center place-items-center">
    <Form @submit="login" :validation-schema="validationSchema">
      <div class="flex flex-col gap-2 bg-slate-50 rounded-lg p-10 w-96">
        <h2 class="font-bold text-xl text-slate-950 mb-4 text-center">
          <i class="pi pi-sign-in pr-2 text-sky-400"></i>
          {{ props.mode === 'login' ? 'Tasker Login' : 'Tasker Register' }}
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
            {{ props.mode === 'login' ? 'Login' : 'Register' }}
          </Button>
        </div>
      </div>
    </Form>
    <span v-if="props.mode === 'login'" class="mt-4 text-lg text-sky-600"
      ><RouterLink to="/register">Sign Up</RouterLink></span
    >
    <span v-else class="mt-4 text-lg text-sky-600"><RouterLink to="/login">Login</RouterLink></span>
    <ToastComponent />
  </div>
</template>

<script lang="ts" setup>
import { Button, useToast } from 'primevue'
import { Field, Form, ErrorMessage } from 'vee-validate'
import type { formData } from '../../models/auth.model'
import { ref } from 'vue'

import { showErrToast } from '../../utils/show-toasts'
import { useAuthStore } from '../../stores/auth.store'
import { authSchema } from '../../schemas/auth-form.schema'
import { toTypedSchema } from '@vee-validate/zod'

const props = defineProps<{ mode: 'login' | 'regestier' }>()
const formInputs = ref<formData>({ email: '', password: '' })
const toast = useToast()
const authStore = useAuthStore()
const validationSchema = toTypedSchema(authSchema)
const login = async () => {
  try {
    const parsedData = authSchema.safeParse(formInputs.value)
    if (parsedData.success) {
      if (props.mode === 'login') await authStore.login(formInputs.value)
      else await authStore.register(formInputs.value)
    } else {
      const errorDetails = parsedData.error.errors.map((err) => err.message).join(', ')
      showErrToast(toast, `Validation Error: ${errorDetails}`)
    }
  } catch (err) {
    console.error('Login Error:', err)
    showErrToast(toast, 'An unexpected error occurred during submittion.')
  }
}

const fieldStyle = 'w-full h-14 border border-slate-200 p-4  block rounded-md'
const labelStyle = 'text-gray-800 text-lg my-2'
const errorStyle = 'text-red-500 text-sm'
</script>
