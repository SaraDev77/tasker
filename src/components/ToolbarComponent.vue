<template>
  <div class="card fixed top-0 right-0 shadow-md z-10">
    <Toolbar class="!bg-sky-200 !bg-opacity-15">
      <template #start>
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText placeholder="Search" />
        </IconField>
      </template>
      <template #end>
        <Button
          @click="(showOverlay = true)"
          icon="pi pi-plus"
          class="mr-2 !bg-sky-700 hover:!bg-sky-600 !rounded-full"
      /></template>
    </Toolbar>
    <OverlayComponent :is-visible="showOverlay" @closeOverlay="closeOverlay" >
    <FormComponent mode="add" :submit-action="handelAddingNewTask" :close-overlay="closeOverlay"/>
    </OverlayComponent>
  </div>
</template>

<script setup lang="ts">
import { Button, IconField, InputIcon, InputText, Toolbar } from 'primevue'
import { ref } from 'vue'
import OverlayComponent from './OverlayComponent.vue'
import FormComponent from './FormComponent.vue';
// import { useTasksStore } from '../stores/tasks';
// const tasks =useTasksStore()
const handelAddingNewTask =()=>{
 console.log('object');
}
const closeOverlay=()=>{
  showOverlay.value=false
}
const showOverlay = ref<boolean>(false)
</script>
