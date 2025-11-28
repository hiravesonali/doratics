<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNav />

    <div class="h-screen flex flex-col">
      <!-- Editor Header -->
      <div class="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink
            :to="`/admin/projects/${projectId}`"
            class="text-blue-600 hover:text-blue-700"
          >
            ← Back to Project
          </NuxtLink>
          <div>
            <h1 class="text-lg font-semibold">Edit Header</h1>
            <p class="text-sm text-gray-500">Editing site-wide header</p>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            @click="saveTheme"
            :disabled="saving"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? "Saving..." : "Save Header" }}
          </button>
        </div>
      </div>

      <!-- Page Builder -->
      <div class="flex-1 overflow-hidden">
        <ClientOnly>
          <PageBuilder />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PageBuilder, getPageBuilder } from "@myissue/vue-website-page-builder";

definePageMeta({
  layout: false,
});

const route = useRoute();
const projectId = route.params.id as string;
const saving = ref(false);

// Initialize Page Builder
onMounted(async () => {
  const pageBuilderService = getPageBuilder();

  const configPageBuilder: Record<string, unknown> = {
    updateOrCreate: {
      formType: "update",
      formName: `header-${projectId}`,
    },
  };

  // Fetch current project to get theme header ID
  const projectResponse = await $fetch(`/api/projects/${projectId}`, {
    headers: { Authorization: "Bearer demo-token" },
  }) as { data: { themeHeaderId: string | null } };

  if (projectResponse.data.themeHeaderId) {
    // Fetch the theme HTML
    const themeResponse = await $fetch(`/api/themes/${projectResponse.data.themeHeaderId}`, {
      headers: { Authorization: "Bearer demo-token" },
    }) as { data: { layoutJson: { html?: string } } };

    const savedHtml = themeResponse.data.layoutJson.html || '';

    if (savedHtml && savedHtml.trim() !== '') {
      try {
        const { components, pageSettings } = pageBuilderService.parsePageBuilderHTML(savedHtml);
        configPageBuilder.pageSettings = pageSettings;
        await pageBuilderService.startBuilder(configPageBuilder, components);
        return;
      } catch (error) {
        console.warn("Failed to parse existing HTML, starting fresh:", error);
      }
    }
  }

  // Start builder fresh
  await pageBuilderService.startBuilder(configPageBuilder);
});

async function saveTheme() {
  saving.value = true;
  try {
    const pageBuilderService = getPageBuilder();
    const htmlContent = pageBuilderService.getSavedPageHtml();

    // Get current project
    const projectResponse = await $fetch(`/api/projects/${projectId}`, {
      headers: { Authorization: "Bearer demo-token" },
    }) as { data: { themeHeaderId: string | null } };

    const themeId = projectResponse.data.themeHeaderId;

    if (themeId) {
      // Update existing theme
      await $fetch(`/api/themes/${themeId}`, {
        method: "PATCH",
        body: { layoutJson: { html: htmlContent } },
        headers: { Authorization: "Bearer demo-token" },
      });
    }

    // Clear localStorage after save
    const storageKey = `page-builder-update-resource-header-${projectId}-default-post`;
    localStorage.removeItem(storageKey);

    alert("Header saved successfully!");
  } catch (error) {
    console.error("Save error:", error);
    alert("Failed to save header");
  } finally {
    saving.value = false;
  }
}
</script>
