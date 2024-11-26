<template>
  <svg class="svg-icon" :style="svgStyle">
    <use :href="symbolId" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  size: {
    type: [Number, String],
    default: '20'
  }
})

// 简化 symbolId 的格式
const symbolId = computed(() => `#${props.name}`)

const svgStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  fill: props.color
}))
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>