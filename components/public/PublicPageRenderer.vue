<template>
  <div class="page-content">
    <!-- Legal Page Renderer -->
    <div v-if="layout.type === 'legal-page'" class="max-w-4xl mx-auto px-4 py-12">
      <div class="prose prose-lg" v-html="markdownToHtml(layout.content)"></div>
    </div>

    <!-- HTML Page Renderer (from PageBuilder) -->
    <div v-else-if="layout.html" v-html="layout.html"></div>

    <!-- Block-based Page Renderer (legacy/fallback) -->
    <div v-else-if="layout.blocks">
      <BlockRenderer
        v-for="(block, index) in layout.blocks"
        :key="index"
        :block="block"
      />
    </div>

    <!-- Empty page -->
    <div v-else class="min-h-[50vh] flex items-center justify-center">
      <p class="text-gray-400">This page is empty. Use the page builder to add content.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  layout: any
}>()

// Simple markdown to HTML converter (you can use a library like marked.js in production)
function markdownToHtml(markdown: string): string {
  if (!markdown) return ''

  return markdown
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>')
    .replace(/<\/p><p><h/g, '</p><h')
    .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
}
</script>

<style scoped>
.prose {
  max-width: 65ch;
}

.prose h1 {
  font-size: 2.25rem;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 2rem;
  line-height: 1.1;
}

.prose h2 {
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 3rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.prose h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.prose p {
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
  line-height: 1.75;
}

.prose strong {
  font-weight: 600;
}
</style>
