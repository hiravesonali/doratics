<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNav />

    <div v-if="page" class="h-screen flex flex-col">
      <!-- Editor Header -->
      <div
        class="bg-white border-b px-4 py-3 flex items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <NuxtLink
            :to="`/admin/websites/${websiteId}`"
            class="text-blue-600 hover:text-blue-700"
          >
            ← Back
          </NuxtLink>
          <div>
            <h1 class="text-lg font-semibold">{{ page.title }}</h1>
            <p class="text-sm text-gray-500">{{ page.slug }}</p>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            @click="savePage"
            :disabled="saving"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? "Saving..." : "Save" }}
          </button>
          <button
            @click="publishPage"
            :disabled="publishing"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {{ publishing ? "Publishing..." : "Publish" }}
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
const pageId = route.params.pageId as string;

const saving = ref(false);
const publishing = ref(false);

// Fetch page data
interface PageResponse {
  success: boolean;
  data: {
    id: string;
    websiteId: string;
    slug: string;
    title: string;
    layoutJson: Record<string, unknown> | string;
    seoTitle: string | null;
    seoDescription: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

const { data: pageData } = await useFetch<PageResponse>(`/api/pages/${websiteId}/${pageId}`, {
  headers: {
    Authorization: "Bearer demo-token",
  },
});

const page = computed(() => pageData.value?.data);

// Initialize Page Builder
onMounted(async () => {
  const pageBuilderService = getPageBuilder();

  // Check if there's existing HTML content to load
  // Use unique formName per page to prevent localStorage conflicts
  const configPageBuilder: Record<string, unknown> = {
    updateOrCreate: {
      formType: "update",
      formName: `page-${websiteId}-${pageId}`, // Unique per page
    },
  };

  // If we have saved HTML content, parse it and load it
  if (page.value?.layoutJson) {
    console.log("layoutJson exists:", page.value.layoutJson);

    // Extract HTML from layoutJson
    let savedHtml = '';
    if (typeof page.value.layoutJson === 'string') {
      savedHtml = page.value.layoutJson;
    } else if (page.value.layoutJson && typeof page.value.layoutJson === 'object') {
      const layoutObj = page.value.layoutJson as Record<string, unknown>;
      savedHtml = (layoutObj.html as string) || '';
    }

    console.log("Extracted HTML:", savedHtml?.substring(0, 200));

    if (savedHtml && savedHtml.trim() !== '' && savedHtml !== '{}') {
      try {
        const { components, pageSettings } = pageBuilderService.parsePageBuilderHTML(savedHtml);
        console.log("Parsed components:", components?.length, "Page settings:", pageSettings);
        configPageBuilder.pageSettings = pageSettings;
        // Start builder with parsed components
        const result = await pageBuilderService.startBuilder(configPageBuilder, components);
        console.info("Page Builder initialized with existing content:", result);
        return;
      } catch (error) {
        console.warn("Failed to parse existing HTML, starting fresh:", error);
      }
    } else {
      console.log("No valid HTML to load, starting fresh");
    }
  }

  // Start builder without existing content (fresh)
  const result = await pageBuilderService.startBuilder(configPageBuilder);
  console.info("Page Builder initialized fresh:", result);
});

async function savePage() {
  saving.value = true;
  try {
    // Get the latest HTML content from PageBuilder
    const pageBuilderService = getPageBuilder();
    const htmlContent = pageBuilderService.getSavedPageHtml();

    console.log("Saving HTML content:", htmlContent?.substring(0, 200));

    await $fetch(`/api/pages/${websiteId}/${pageId}`, {
      method: "PATCH",
      body: {
        layoutJson: { html: htmlContent },
      },
      headers: {
        Authorization: "Bearer demo-token",
      },
    });

    // Clear localStorage after successful save to prevent stale data
    // Database is now the single source of truth
    const storageKey = `page-builder-update-resource-page-${websiteId}-${pageId}-default-post`;
    localStorage.removeItem(storageKey);

    alert("Page saved!");
  } catch (error: unknown) {
    console.error("Save error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to save page";
    alert(errorMessage);
  } finally {
    saving.value = false;
  }
}

async function publishPage() {
  publishing.value = true;
  try {
    // Get the latest HTML content from PageBuilder
    const pageBuilderService = getPageBuilder();
    const htmlContent = pageBuilderService.getSavedPageHtml();

    console.log("Publishing HTML content:", htmlContent?.substring(0, 200));

    await $fetch(`/api/pages/${websiteId}/${pageId}`, {
      method: "PATCH",
      body: {
        layoutJson: { html: htmlContent },
        status: "published",
      },
      headers: {
        Authorization: "Bearer demo-token",
      },
    });

    // Clear localStorage after successful publish to prevent stale data
    // Database is now the single source of truth
    const storageKey = `page-builder-update-resource-page-${websiteId}-${pageId}-default-post`;
    localStorage.removeItem(storageKey);

    alert("Page published!");
  } catch (error: unknown) {
    console.error("Publish error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to publish page";
    alert(errorMessage);
  } finally {
    publishing.value = false;
  }
}
</script>
