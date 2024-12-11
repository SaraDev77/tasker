<template>
  <aside
    class="max-h-screen bg-slate-900 bg-opacity-25 w-2.5 flex flex-col shadow-md"
    @click="toggleShow"
  ></aside>
  <aside
    class="max-h-screen bg-slate-100 lg:w-1/6 flex flex-col shadow-md z-10 md:relative"
    v-if="show"
  >
    <div class="card flex justify-start">
      <div class="flex flex-col h-full w-full justify-between">
        <div class="flex items-center justify-between px-6 pt-4 shrink-0">
          <span class="inline-flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
              />
            </svg>
            <RouterLink to="/">
              <span class="font-semibold text-2xl text-gray-800">Tasker</span></RouterLink
            >
          </span>
        </div>
        <div class="overflow-y-auto">
          <ul class="list-none p-4 m-0">
            <li class="w-full">
              <div
                @click="toggleSection(!showFirstSection)"
                class="p-4 flex items-center justify-between text-sky-500 dark:text-sky-400 cursor-pointer p-ripple"
              >
                <span class="text-xl font-semibold">Main</span>
                <i class="pi pi-chevron-right" v-if="!showFirstSection"></i>
                <i class="pi pi-chevron-down" v-else></i>
              </div>
              <ul class="list-none p-0 m-0 overflow-hidden" v-if="showFirstSection">
                <RouterLink to="/">
                  <li class="w-full">
                    <a
                      v-ripple
                      class="flex items-center cursor-pointer p-4 rounded text-sky-700 hover:bg-sky-100 dark:text-sky-0 dark:hover:bg-sky-800 duration-150 transition-colors p-ripple"
                    >
                      <i class="pi pi-home mr-2"></i>
                      <span class="font-medium">Home</span>
                    </a>
                  </li></RouterLink
                >
                <RouterLink to="/diagrams">
                  <li class="w-full">
                    <a
                      v-ripple
                      class="flex items-center cursor-pointer p-4 rounded text-sky-700 hover:bg-sky-100 dark:text-sky-0 dark:hover:bg-sky-800 duration-150 transition-colors p-ripple"
                    >
                      <i class="pi pi-chart-bar mr-2"></i>
                      <span class="font-medium">Diagrams</span>
                    </a>
                  </li></RouterLink
                >
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="flex-1 flex flex-col justify-end">
      <hr class="mb-4 mx-4 border-t border-0 border-sky-200 dark:border-sky-700" />
      <a
        @click="signOut"
        class="m-4 flex items-center cursor-pointer p-2 gap-2 rounded text-sky-700 hover:bg-sky-100 dark:text-sky-0 dark:hover:bg-sky-800 duration-150 transition-colors p-ripple"
      >
        <i class="pi pi-sign-out text-sky-600"></i>
        <span class="font-bold">Log out</span>
      </a>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth.store'

const authStore = useAuthStore()
const showFirstSection = ref(true)
const show = ref(true)

const signOut = () => authStore.localLogout()
const toggleShow = () => (show.value = !show.value)
const toggleSection = (show: boolean) => {
  showFirstSection.value = show
}
</script>
