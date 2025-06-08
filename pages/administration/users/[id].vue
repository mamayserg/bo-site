<template>
  <admin-users-form
    ref="form"
    :title="'Update user'"
    :user="user"
    :customers="customers"
    @submit="updateUser"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import AdminUsersForm from "~/components/administration/users/AdminUsersForm.vue";
import { useUsersStore } from "~/stores/users";
import { useNotificationStore } from "~/stores/notification";
// import { Roles } from '~/constants/roles'

// defineOptions({
//   name: 'AdminUsersEdit',
//   middleware: 'authenticated',
//   meta: {
//     authorizedRoles: [Roles.SUPER_ADMIN, Roles.USER_MANAGER]
//   }
// })

const form = ref();

const route = useRoute();
const router = useRouter();

const usersStore = useUsersStore();
const notificationStore = useNotificationStore();

const user = computed(() => usersStore.currentUser);
const customers = computed(() => usersStore.customers);

onMounted(async () => {
  await usersStore.loadUser(route.params.id);
  await usersStore.loadCustomers();
});

const updateUser = async (params: any) => {
  await usersStore.updateUser(params.user);
  notificationStore.success(`User "${user.value.username}" updated`);
  router.push("/administration/users");
};
</script>
