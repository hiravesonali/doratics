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
    <div v-else class="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-16">
      <div class="text-center max-w-md">
        <div class="mb-6">
          <svg class="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-3">
          This Page is Empty
        </h2>
        <p class="text-gray-600 leading-relaxed mb-6">
          Ready to bring your vision to life? Use the page builder to create beautiful, engaging content for your visitors.
        </p>
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Start building your page in the editor
        </div>
      </div>
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
