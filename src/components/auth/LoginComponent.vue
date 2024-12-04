<template>
  <div class="min-h-screen w-full bg-sky-100 flex justify-center place-items-center">
    <Form @submit="login">
      <div class="flex flex-col gap-2 bg-slate-50 rounded-lg p-10 w-96">
        <h2 class="font-bold text-xl text-slate-950 mb-4 text-center">
          <i class="pi pi-sign-in pr-2 text-sky-400"></i>Tasker Login
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

          <Button class="!rounded-md !bg-sky-600 !border-none hover:!bg-sky-500" type="submit">Login</Button>
        </div>
      </div>
    </Form>
  </div>
</template>
<script lang="ts" setup>
import { Button } from 'primevue'
import { Field, Form, ErrorMessage } from 'vee-validate'
import type { formData } from '../../models/auth.model'
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth';
const formInputs = ref<formData>({ email: '', password: '' })
const authStore=useAuthStore()
const login =()=>authStore.login(formInputs.value)
const fieldStyle = 'w-full h-14 border border-slate-200 p-4  block rounded-md'
const labelStyle = 'text-gray-800 text-lg my-2'
const errorStyle = 'text-red-500 text-sm'
</script>
