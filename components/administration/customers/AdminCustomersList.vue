<template>
  <div class="space-y-4">
    <Toolbar class="bg-primary text-white">
      <template #start>
        <div class="text-xl font-semibold" data-testid="customer-list-title">
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
            append-icon="pi pi-search"
            data-testid="search-input"
          />
          <Button
            icon="pi pi-plus"
            label="New customer"
            severity="primary"
            @click="navigateTo('/administration/customers/create')"
            data-testid="creation-btn"
          />
        </div>

        <DataTable
          :value="filteredItems"
          dataKey="id"
          paginator
          :rows="10"
          :rowsPerPageOptions="[10, 50, { label: 'All', value: -1 }]"
          :loading="loading"
          responsiveLayout="scroll"
        >
          <Column field="name" header="Customers" />
          <Column field="code" header="Code" />
          <Column field="timezone" header="Timezone" />
          <Column field="createDate" header="Create Date" :body="formatDate" />
          <Column field="updateDate" header="Update Date" :body="formatDate" />

          <Column header="Actions" style="width: 160px" class="text-center">
            <template #body="slotProps">
              <div class="flex justify-center items-center gap-2">
                <Button
                  icon="pi pi-pencil"
                  class="edit-btn"
                  severity="info"
                  rounded
                  text
                  @click="
                    navigateTo(`/administration/customers/${slotProps.data.id}`)
                  "
                  data-testid="edit-btn"
                />
                <DeleteButton
                  :disabled="slotProps.data.sites?.length > 0"
                  disabled-description="Sites are linked to this customer"
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import DeleteButton from "~/components/commons/DeleteButton.vue";
import { useCustomersStore } from "~/stores/customers";
import { useNotificationStore } from "~/stores/notification";

defineProps({
  title: {
    type: String,
    default: "Customers",
  },
});

const router = useRouter();
const customersStore = useCustomersStore();
const notificationStore = useNotificationStore();

const search = ref("");
const loading = ref(false);

const filteredItems = computed(() => {
  if (!search.value) return customersStore.customers;
  return customersStore.customers.filter((c) =>
    c.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const navigateTo = (path: string) => {
  router.push(path);
};

const formatDate = (date: string | null) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })}`;
};

const onDeleteAction = async (customer: any) => {
  try {
    loading.value = true;
    // await customersStore.deleteCustomer(customer);
    await customersStore.loadCustomers();
    notificationStore.success(`Customer "${customer.name}" removed`);
  } catch {
    notificationStore.error("An error occurred");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  await customersStore.loadCustomers();
  loading.value = false;
});
</script>

<style scoped>
/* Use Tailwind or add styles here */
</style>
