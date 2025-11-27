<template>
  <component :is="blockComponent" :block="block" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const props = defineProps<{
  block: any
}>()

// Map block types to components
const blockComponents: Record<string, any> = {
  hero: defineAsyncComponent(() => import('./blocks/HeroBlock.vue')),
  'image-text': defineAsyncComponent(() => import('./blocks/ImageTextBlock.vue')),
  'service-grid': defineAsyncComponent(() => import('./blocks/ServiceGridBlock.vue')),
  testimonials: defineAsyncComponent(() => import('./blocks/TestimonialsBlock.vue')),
  'contact-form': defineAsyncComponent(() => import('./blocks/ContactFormBlock.vue')),
  cta: defineAsyncComponent(() => import('./blocks/CTABlock.vue')),
}

const blockComponent = computed(() => {
  return blockComponents[props.block?.type] || 'div'
})
</script>
