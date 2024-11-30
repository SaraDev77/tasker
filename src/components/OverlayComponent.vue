<template>
  <Teleport to="body">
    <div
      v-if="props.isVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeOverlay"
    >
      <div class="bg-white rounded-lg p-6 shadow-lg">
        <slot></slot>
        <button
          @click="closeOverlay"
          class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  </Teleport>
</template>
<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue';


const props = defineProps<{
  isVisible: boolean;
}>();


const emit = defineEmits<{
  (event: "closeOverlay"): void;
}>();

const closeOverlay = () => {
  emit("closeOverlay"); 
};
</script>
