<template>
  <div class="flex lg:flex-row flex-col lg:items-center items-start lg:justify-start gap-4 m-4">
    <div class="flex flex-col justify-center items-center">
      <Knob
        :value="timerValue"
        :modelValue="timerValue"
        :max="60"
        :min="0"
        :value-color="'#007BFF'"
        :range-color="'#D3D3D3'"
        :size="100"
        :readonly="true"
      />
      <p class="text-gray-400">Minutes left</p>
    </div>
<div class="flex gap-4">
    <Button
      @click="startTimer"
      :disabled="isRunning"
      class="!bg-blue-500 !text-white !px-4 !py-2 !rounded !border-none hover:!bg-blue-600"
    >
      Start Timer
    </Button>
    <Button
      @click="stopTimer"
      :disabled="!isRunning"
      class="!bg-yellow-500 !text-white !px-4 !py-2 !rounded !border-none hover:!bg-yellow-600"
    >
      Stop Timer
    </Button>
    <Button @click="resetTimer" class="!bg-red-500 !text-white !px-4 !py-2 !border-none !rounded hover:!bg-red-600">
      Reset Timer
    </Button></div>
  </div>
</template>

<script lang="ts" setup>

import { Button, Knob } from 'primevue' 
import { ref } from 'vue'

const timerValue = ref(60) 
const isRunning = ref(false) 
let timerInterval: ReturnType<typeof setInterval> | null = null

const startTimer = () => {
  if (!isRunning.value) {
    isRunning.value = true
    timerInterval = setInterval(() => {
      if (timerValue.value > 0) {
        timerValue.value -= 1 
      } else {
        stopTimer()
      }
    }, 60000) 
  }
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null 
    isRunning.value = false
  }
}

const resetTimer = () => {
  stopTimer() 
  timerValue.value = 60 
}
</script>
