<template>
  <Card
    :class="[[bgColor],'!max-h-[48rem]', '!m-4', '!overflow-y-scroll', '!overflow-y-auto', '!p-2', '!scrollbar-thin' ,'!scrollbar-' ,'!scrollbar-track-gray-100']"
  >
    <template #header>
      <img
        alt="user header"
        src="https://primefaces.org/cdn/primevue/images/usercard.png"
        class="!h-4"
      />
    </template>
    <template #title><div class="flex justify-between"><h1>{{ props.title }}</h1><span class="text-sm text-gray-400">Count: {{ props.count }}</span></div></template>
    <template #content>
      <slot name="cards"></slot>
    </template>
  </Card>
</template>

<script lang="ts" setup>
import { Card } from 'primevue'

const props = defineProps<{ title: string; bgColor: string ,count:number}>()
</script>
