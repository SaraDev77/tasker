<template>
  <Splitter class="!h-36"  layout="horizontal">
    <SplitterPanel :size="25" class="flex items-center justify-center"
      ><slot name="title"></slot>
    </SplitterPanel>
    <SplitterPanel class="flex items-center justify-center">
      <slot name="data"></slot>
    </SplitterPanel>
  </Splitter>
</template>

<script lang="ts" setup>
import { Splitter, SplitterPanel } from 'primevue'

</script>
