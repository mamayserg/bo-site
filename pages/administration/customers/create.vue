<template>
  <AdminCustomersForm
    ref="form"
    title="Create customer"
    :customer="customer"
    :code-disabled="false"
    @submit="createCustomer"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminCustomersForm from '@/components/administration/customers/AdminCustomersForm.vue';
import { useCustomersStore } from '@/stores/customers';
import { useNotificationStore } from '@/stores/notification';
// import { Roles } from '@/constants/roles';

// Set component options
// defineOptions({
//   name: 'AdminCustomersAdd',
//   middleware: 'authenticated',
//   meta: {
//     authorizedRoles: [Roles.SUPER_ADMIN],
//   },
// });

// Refs & stores
const form = ref<InstanceType<typeof AdminCustomersForm>>();
const router = useRouter();
const customersStore = useCustomersStore();
const notification = useNotificationStore();

const customer = customersStore.currentCustomer;

onMounted(() => {
  customersStore.resetCustomer();
});

const createCustomer = async (newCustomer: any) => {
  try {
    await customersStore.postCustomer(newCustomer);
    notification.success(`Customer "${newCustomer.name}" created`);
    router.push('/administration/customers');
  } catch (error: any) {
    notification.error();
    error.response?.data?.violations?.forEach((violation: any) => {
      form.value?.addError(violation.propertyPath, violation.message);
    });
  }
};
</script>
