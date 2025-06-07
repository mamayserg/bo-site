<template>
  <div class="space-y-4">
    <Toolbar class="bg-primary text-white">
      <template #start>
        <div class="text-xl font-semibold" data-testid="destination-list-title">
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
            label="New destination"
            icon="pi pi-plus"
            class="w-full md:w-auto"
            @click="navigateTo('/administration/destinations/create')"
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
          <Column field="name" header="Destinations" />

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
                      `/administration/destinations/${slotProps?.data?.id}`
                    )
                  "
                  data-testid="edit-btn"
                />
                <DeleteButton
                  :disabled="slotProps?.data?.segments?.length > 0"
                  disabled-description="Segments groups are linked to this destination"
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
import DeleteButton from '@/components/commons/DeleteButton.vue';
import { useDestinationsStore } from "~/stores/destinations";
import { useNotificationStore } from "@/stores/notification";

 defineProps({
  title: {
    type: String,
    default: "Destinations",
  },
});

const router = useRouter();
const destinationsStore = useDestinationsStore();
const notificationStore = useNotificationStore();

const search = ref("");

const filteredItems = computed(() => {
  if (!search.value) return destinationsStore.destinations;
  return destinationsStore.destinations.filter((d) =>
    d.name?.toLowerCase().includes(search.value.toLowerCase())
  );
});

const navigateTo = (path: string) => {
  router.push(path);
};

const onDeleteAction = async (destination: any) => {
  try {
    await destinationsStore.deleteDestination(destination);
    await destinationsStore.loadDestinations();
    notificationStore.success(`Destination "${destination.name}" removed`);
  } catch {
    notificationStore.error("An error occurred");
  }
};

onMounted(() => {
  destinationsStore.loadDestinations();
});
</script>
