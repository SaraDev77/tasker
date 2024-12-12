<template>
  <Teleport to="body">
    <div
      v-if="props.isVisible"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      @click.self="closeOverlay"
    >
      <div class="bg-gray-100 rounded-lg py-10 px-6 shadow-lg min-w-[30rem]">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>
<script lang="ts" setup>

const props = defineProps<{
  isVisible: boolean
}>()

const emit = defineEmits<{
  (event: 'closeOverlay'): void
}>()

const closeOverlay = () => {
  emit('closeOverlay')
}

</script>
