<template>
  <div class="space-y-4">
    <Toolbar class="bg-primary text-white">
      <template #start>
        <div class="text-xl font-semibold" data-testid="type-list-title">
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
          <Button
            label="New Type"
            icon="pi pi-plus"
            class="w-full md:w-auto"
            @click="navigateTo('/administration/types/create')"
            data-testid="creation-btn"
          />
        </div>

        <DataTable
          :value="filteredItems"
          dataKey="id"
          responsiveLayout="scroll"
          paginator
          :rows="10"
          :rowsPerPageOptions="[10, 50, 100]"
        >
          <Column field="name" header="Types"></Column>

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
                    navigateTo(`/administration/types/${slotProps.data.id}`)
                  "
                  data-testid="edit-btn"
                />
                <DeleteButton
                  :disabled="slotProps?.data?.segments?.length > 0"
                  disabled-description="Segments groups are linked to this type"
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
// import { Button } from 'primevue/button';
// import { Card } from 'primevue/card';
// import { Column } from 'primevue/column';
// import { DataTable } from 'primevue/datatable';
// import { InputText } from 'primevue/inputtext';
// import { Toolbar } from 'primevue/toolbar';
// import { Tooltip } from 'primevue/tooltip';
import { ref, computed, onMounted } from 'vue';
import DeleteButton from '@/components/commons/DeleteButton.vue';
import { useNotificationStore } from '@/stores/notification';
import { useTypesStore } from '@/stores/types';


defineProps({
  title: {
    type: String,
    default: 'Types',
  },
});

const router = useRouter();
const typesStore = useTypesStore();
const notificationStore = useNotificationStore();

const search = ref('');
const filteredItems = computed(() => {
  if (!search.value) return typesStore.types;

  return typesStore.types.filter((t: { name: string }) =>
    t.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const navigateTo = (path: string) => {
  router.push(path);
};

const onDeleteAction = async (type: any) => {
  try {
    await typesStore.deleteType(type);
    await typesStore.loadTypes();
    notificationStore.success(`Type "${type.name}" removed`);
  } catch {
    notificationStore.error('An error occurred');
  }
};

onMounted(async () => {
  await typesStore.loadTypes();
});
</script>

<style scoped>
/* PrimeVue components usually styled with Tailwind utilities */
</style>
