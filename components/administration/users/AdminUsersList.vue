<template>
  <div class="space-y-4">
    <Toolbar class="bg-primary text-white">
      <template #start>
        <div class="text-xl font-semibold" data-testid="user-list-title">
          Users
        </div>
      </template>
    </Toolbar>

    <Card>
      <template #content>
        <div class="mb-4 w-full md:w-1/2">
          <InputText
            v-model="search"
            placeholder="Search"
            class="w-full"
            append-icon="pi pi-search"
            data-testid="search-input"
          />
        </div>

        <DataTable
          :value="filteredUsers"
          dataKey="id"
          responsiveLayout="scroll"
          paginator
          :rows="10"
          :rowsPerPageOptions="[10, 50, { label: 'All', value: -1 }]"
          :sortField="pagination?.sortBy"
          :sortOrder="1"
          :loading="loading"
        >
          <Column
            header="Users (Firstname LASTNAME)"
            :sortable="true"
            :field="'username'"
            :body="userFullName"
          />
          <Column field="username" header="Username" sortable />
          <Column field="email" header="Email" sortable />

          <Column header="Customers">
            <template #body="{ data }">
              <div>
                <span
                  v-for="(customer, index) in data?.customers"
                  :key="customer.id"
                >
                  {{ customer?.name
                  }}<span v-if="index !== data?.customers.length - 1">, </span>
                </span>
              </div>
            </template>
          </Column>

          <Column field="apiKey" header="API Key" sortable />

          <Column
            header="Super Admin"
            :sortable="false"
            style="text-align: center"
          >
            <!-- <template #body="{ data }">
              <i
                v-if="isSuperAdmin(data)"
                class="pi pi-star"
                style="color: #facc15; font-size: 1.25rem"
                aria-label="Super Admin"
                title="Super Admin"
              />
            </template> -->
          </Column>

          <Column
            header="Actions"
            :sortable="false"
            style="text-align: right; width: 120px"
          >
            <template #body="{ data }">
              <Tooltip target=".edit-btn" />
              <Button
                icon="pi pi-pencil"
                class="edit-btn"
                severity="info"
                rounded
                text
                @click="() => navigateTo(`/administration/users/${data?.id}`)"
                data-testid="edit-btn"
              />
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

import { useUsersStore } from "~/stores/users";

const router = useRouter();
const usersStore = useUsersStore();

const search = ref("");
const loading = ref(false);

const pagination = ref({
  sortBy: "username",
});

const filteredUsers = computed(() => {
  if (!search.value) {
    return usersStore.users;
  }
  return usersStore?.users.filter((user) => {
    const fullName = `${user?.firstName} ${user?.lastName}`.toLowerCase();
    return (
      fullName?.includes(search.value?.toLowerCase()) ||
      user?.username.toLowerCase().includes(search.value?.toLowerCase()) ||
      user?.email.toLowerCase().includes(search.value?.toLowerCase())
    );
  });
});

// const isSuperAdmin = (user: any) => {
//   return user.roles?.includes(Roles.SUPER_ADMIN);
// };

const userFullName = (user: any) => {
  return `${user?.firstName} ${user?.lastName}`;
};

const navigateTo = (path: string) => {
  router.push(path);
};

onMounted(async () => {
  loading.value = true;
  await usersStore.loadUsers();
  loading.value = false;
});
</script>
