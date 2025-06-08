<template>
  <div class="space-y-4">
    <Toolbar class="bg-primary text-white">
      <template #start>
        <div class="text-xl font-semibold" data-testid="input-type-list-title">
          {{ title }}
        </div>
      </template>
    </Toolbar>

    <Card>
      <template #content>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <InputText
            v-model="search"
            placeholder="Search"
            class="w-full md:w-2/3"
            append-icon="pi pi-search"
            data-testid="search-input"
          />
          <Button
            icon="pi pi-plus"
            label="New input type"
            severity="primary"
            @click="navigateTo('/administration/inputTypes/create')"
            data-testid="creation-btn"
          />
        </div>

        <DataTable
          :value="filteredItems"
          dataKey="id"
          responsiveLayout="scroll"
          paginator
          :rows="10"
          :rowsPerPageOptions="[10, 50, {label: 'All', value: -1}]"
          :loading="loading"
        >
          <Column field="name" header="Input types" />

          <Column header="Actions" style="width: 160px" class="text-center">
            <template #body="slotProps">
              <div class="flex justify-center items-center gap-2">
                <Tooltip target=".edit-btn" />
                <Button
                  icon="pi pi-pencil"
                  class="edit-btn"
                  severity="info"
                  rounded
                  text
                  @click="navigateTo(`/administration/inputTypes/${slotProps.data.id}`)"
                  data-testid="edit-btn"
                />
                <DeleteButton
                  :disabled="slotProps.data.segments?.length > 0"
                  disabled-description="Segments groups are linked to this input type"
                  @deleteAction="() => onDeleteAction(slotProps.data)"
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import Toolbar from 'primevue/toolbar';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tooltip from 'primevue/tooltip';

import DeleteButton from '~/components/commons/DeleteButton.vue';

// Assume Pinia store similar to Vuex store in original
import { useInputTypesStore } from '~/stores/inputTypes';
import { useNotificationStore } from '~/stores/notification';

defineProps({
  title: {
    type: String,
    default: 'Input types',
  },
});

const router = useRouter();
const inputTypesStore = useInputTypesStore();
const notificationStore = useNotificationStore();

const search = ref('');
const loading = ref(false);

const filteredItems = computed(() => {
  if (!search.value) return inputTypesStore.inputTypes;
  return inputTypesStore.inputTypes.filter(i =>
    i.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const navigateTo = (path: string) => {
  router.push(path);
};

const onDeleteAction = async (inputType: any) => {
  try {
    loading.value = true;
    await inputTypesStore.deleteInputType(inputType);
    await inputTypesStore.loadInputTypes();
    notificationStore.success(`Input type "${inputType.name}" removed`);
  } catch (error) {
    notificationStore.error('An error occured');
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  await inputTypesStore.loadInputTypes();
  loading.value = false;
});
</script>

<style scoped>
/* Add your styles or Tailwind here */
</style>
