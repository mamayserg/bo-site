<template>
  <AdminTypesForm
    ref="formRef"
    title="Create Type"
    :type="type"
    @submit="createType"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminTypesForm from '@/components/administration/types/AdminTypesForm.vue';
import { useNotificationStore } from '@/stores/notification';
import { useTypesStore } from '@/stores/types';

// Optional: if using Nuxt middleware
// definePageMeta({
//   middleware: 'authenticated',
//   authorizedRoles: ['SUPER_ADMIN'],
// });

const router = useRouter();
const formRef = ref<InstanceType<typeof AdminTypesForm>>();

const typesStore = useTypesStore();
const notificationStore = useNotificationStore();

// Safely create local copy for editing (SSR-safe)
const type = ref({ name: '' });

onMounted(() => {
  typesStore.resetType(); // Optional: clear previous state
  Object.assign(type.value, { ...typesStore.currentType }); // Shallow clone for editing
});

const createType = async (newType: typeof type.value) => {
  try {
    await typesStore.postType(newType);
    notificationStore.success(`Type "${newType.name}" created`);
    router.push('/administration/types');
  } catch (error: any) {
    notificationStore.error('Failed to create type');

    // Symfony-style violation handling
    if (error?.response?.data?.violations && formRef.value?.addError) {
      error.response.data.violations.forEach((violation: any) => {
        formRef.value?.addError(violation.propertyPath, violation.message);
      });
    }
  }
};
</script>
