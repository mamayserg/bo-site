<template>
  <AdminCustomersForm
    ref="form"
    title="Update customer"
    :customer="customer"
    :code-disabled="true"
    @submit="updateCustomer"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdminCustomersForm from '@/components/administration/customers/AdminCustomersForm.vue';
import { useCustomersStore } from '@/stores/customers';
import { useNotificationStore } from '@/stores/notification';
// import { Roles } from '@/constants/roles';

// // Component options
// defineOptions({
//   name: 'AdminCustomersEdit',
//   middleware: 'authenticated',
//   meta: {
//     authorizedRoles: [Roles.SUPER_ADMIN],
//   },
// });

// Refs & stores
const form = ref<InstanceType<typeof AdminCustomersForm>>();
const route = useRoute();
const router = useRouter();
const customersStore = useCustomersStore();
const notification = useNotificationStore();

const customer = customersStore.currentCustomer;

onMounted(async () => {
  await customersStore.loadCustomer(Number(route.params.id));
  await customersStore.loadCustomers();
});

const updateCustomer = async (updatedCustomer: any) => {
  // Strip metadata fields before update
  delete updatedCustomer.createDate;
  delete updatedCustomer.updateDate;

  try {
    await customersStore.updateCustomer(updatedCustomer);
    notification.success(`Customer "${customer.name}" updated`);
    router.push('/administration/customers');
  } catch (error: any) {
    notification.error();
    error.response?.data?.violations?.forEach((violation: any) => {
      form.value?.addError(violation.propertyPath, violation.message);
    });
  }
};
</script>
