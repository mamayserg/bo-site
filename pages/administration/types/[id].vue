<template>
  <AdminTypesForm
    ref="formRef"
    title="Update type"
    :type="type"
    @submit="updateType"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdminTypesForm from '@/components/administration/types/AdminTypesForm.vue';
import { useNotificationStore } from '@/stores/notification';
import { useTypesStore } from '@/stores/types';

const formRef = ref();
const route = useRoute();
const router = useRouter();

const notificationStore = useNotificationStore();
const typesStore = useTypesStore();

const type = computed(()=>typesStore.currentType);

// Load type on mount
onMounted(async () => {
  await typesStore.loadType(route.params.id);
  await typesStore.loadTypes(); // if needed elsewhere
});

const updateType = async (updatedType: typeof type.value) => {
  try {
    await typesStore.updateType(updatedType);
    notificationStore.success(`Type "${updatedType.name}" updated`);
    router.push('/administration/types');
  } catch (error: any) {
    notificationStore.error('Failed to update type');

    if (error?.response?.data?.violations && formRef.value?.addError) {
      error.response.data.violations.forEach((violation: any) => {
        formRef.value.addError(violation.propertyPath, violation.message);
      });
    }
  }
};
</script>
