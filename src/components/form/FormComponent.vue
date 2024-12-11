<template>
  <Form :validation-schema="validationSchema" @submit="submitData" >
    <slot name="formTitle"></slot>
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-2">
        <label for="title" :class="labelStyle">Title</label>
        <slot name="title"></slot>
        <hr />
      </div>
      <div class="flex flex-col gap-2">
        <label for="deadline" :class="labelStyle">Deadline</label>
        <slot name="deadline"></slot>
        <hr />
      </div>
      <div class="flex flex-col gap-2 ">
        <label for="status" :class="labelStyle">Status</label>
        <slot name="status"></slot>
      </div>
      <div class="flex flex-col gap-2">
        <label for="description" :class="labelStyle">Task Description</label>
        <slot name="description"></slot>
      </div>
      <div class="flex justify-end gap-2 mt-6">
        <Button
          class="!rounded-md !bg-sky-600 !border-none hover:!bg-sky-500"
          @click="props.submitData"
          >Submit</Button
        >
        <Button
          class="!rounded-md !bg-red-600 !border-none hover:!bg-red-500"
          @click="props.closeOverlay"
          >Close</Button
        >
      </div>
    </div>
  </Form>
  <ToastComponent />
</template>

<script lang="ts" setup>

import { toTypedSchema } from '@vee-validate/zod';
import { Button } from 'primevue'
import {Form } from 'vee-validate'

const props = defineProps<{
  submitData: () => void
  closeOverlay: () => void
  validationSchema: Zod.AnyZodObject
}>()

const validationSchema = toTypedSchema(props.validationSchema)

const labelStyle = 'text-gray-800 text-lg my-2'
</script>
