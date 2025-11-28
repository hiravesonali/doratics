<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNav />

    <div class="h-screen flex flex-col">
      <!-- Editor Header -->
      <div class="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink
            :to="`/admin/websites/${websiteId}`"
            class="text-blue-600 hover:text-blue-700"
          >
            ← Back to Website
          </NuxtLink>
          <div>
            <h1 class="text-lg font-semibold">Edit Footer</h1>
            <p class="text-sm text-gray-500">Editing site-wide footer</p>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            @click="saveTheme"
            :disabled="saving"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? "Saving..." : "Save Footer" }}
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
const websiteId = route.params.id as string;
const saving = ref(false);

// Initialize Page Builder
onMounted(async () => {
  const pageBuilderService = getPageBuilder();

  const configPageBuilder: Record<string, unknown> = {
    updateOrCreate: {
      formType: "update",
      formName: `footer-${websiteId}`,
    },
  };

  // Fetch current website to get theme footer ID
  const websiteResponse = await $fetch(`/api/websites/${websiteId}`, {
    headers: { Authorization: "Bearer demo-token" },
  }) as { data: { themeFooterId: string | null } };

  if (websiteResponse.data.themeFooterId) {
    // Fetch the theme HTML
    const themeResponse = await $fetch(`/api/themes/${websiteResponse.data.themeFooterId}`, {
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

    // Get current website
    const websiteResponse = await $fetch(`/api/websites/${websiteId}`, {
      headers: { Authorization: "Bearer demo-token" },
    }) as { data: { themeFooterId: string | null } };

    const themeId = websiteResponse.data.themeFooterId;

    if (themeId) {
      // Update existing theme
      await $fetch(`/api/themes/${themeId}`, {
        method: "PATCH",
        body: { layoutJson: { html: htmlContent } },
        headers: { Authorization: "Bearer demo-token" },
      });
    }

    // Clear localStorage after save
    const storageKey = `page-builder-update-resource-footer-${websiteId}-default-post`;
    localStorage.removeItem(storageKey);

    alert("Footer saved successfully!");
  } catch (error) {
    console.error("Save error:", error);
    alert("Failed to save footer");
  } finally {
    saving.value = false;
  }
}
</script>
