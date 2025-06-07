<template>
  <div class="space-y-4">
    <Toolbar class="bg-primary text-white">
      <template #start>
        <div
          class="text-xl font-semibold"
          data-testid="template-type-list-title"
        >
          {{ title }}
        </div>
      </template>
    </Toolbar>

    <Card>
      <template #content>
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4"
        >
          <InputText
            v-model="search"
            placeholder="Search"
            class="w-full md:w-2/3"
            data-testid="search-input"
          />
        </div>

        <DataTable
          :value="filteredItems"
          dataKey="id"
          responsiveLayout="scroll"
          paginator
          :rows="10"
          :rowsPerPageOptions="[10, 50, 100]"
          :loading="loading"
        >
          <Column field="name" header="Template types"></Column>
          <Column field="code" header="Code"></Column>

          <Column header="Actions" style="width: 200px">
            <template #body="slotProps">
              <div class="flex justify-center items-center gap-2">
                <Tooltip target=".edit-btn" />
                <Button
                  icon="pi pi-pencil"
                  class="edit-btn"
                  severity="info"
                  rounded
                  text
                  @click="
                    navigateTo(
                      `/administration/templateTypes/${slotProps.data.id}`
                    )
                  "
                  data-testid="edit-btn"
                />
                <DeleteButton
                  :disabled="slotProps?.data?.segments?.length > 0"
                  disabled-description="Segments groups are linked to this template type"
                  @deleteAction="onDeleteAction(slotProps.data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import Toolbar from "primevue/toolbar";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Tooltip from "primevue/tooltip";

import DeleteButton from "~/components/commons/DeleteButton.vue";
import { useNotificationStore } from "~/stores/notification";
import { useTemplateTypesStore } from "~/stores/templateTypes";

defineProps({
  title: {
    type: String,
    default: "Template types",
  },
});

const router = useRouter();
const templateTypesStore = useTemplateTypesStore();
const notificationStore = useNotificationStore();

const search = ref("");
const loading = ref(false);

const filteredItems = computed(() => {
  if (!search.value) return templateTypesStore.templateTypes;

  return templateTypesStore.templateTypes.filter((t: { name: string }) =>
    t.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const navigateTo = (path: string) => {
  router.push(path);
};

const onDeleteAction = async (templateType: any) => {
  try {
    loading.value = true;
    await templateTypesStore.deleteTemplateType(templateType);
    await templateTypesStore.loadTemplateTypes();
    notificationStore.success(`Template type "${templateType.name}" removed`);
  } catch {
    notificationStore.error("An error occurred");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  await templateTypesStore.loadTemplateTypes();
  loading.value = false;
});
</script>

<style scoped>
/* Use Tailwind or your own styling here */
</style>
