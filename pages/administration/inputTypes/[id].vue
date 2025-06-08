<template>
  <AdminInputTypesForm
    ref="form"
    title="Update input type"
    :input-type="inputType"
    @submit="updateInputType"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useInputTypesStore } from '@/stores/inputTypes';
import { useNotificationStore } from '@/stores/notification';
// import { Roles } from '@/constants/roles';
import AdminInputTypesForm from '@/components/administration/inputTypes/AdminInputTypesForm.vue';
// import { useAuthGuard } from '@/composables/useAuthGuard';

// useAuthGuard([Roles.SUPER_ADMIN]);

const form = ref(null);
const route = useRoute();
const router = useRouter();

const inputTypesStore = useInputTypesStore();
const notificationStore = useNotificationStore();

const inputType = inputTypesStore.currentInputType;

onMounted(async () => {
  await inputTypesStore.loadInputType(route.params.id);
  await inputTypesStore.loadInputTypes();
});

const updateInputType = async (updatedInputType) => {
  try {
    await inputTypesStore.updateInputType(updatedInputType);
    notificationStore.success(`Input type "${inputType.name}" updated`);
    router.push('/administration/inputTypes');
  } catch (error) {
    notificationStore.error();
    const violations = error?.response?.data?.violations || [];
    violations.forEach(v => {
      form.value?.addError(v.propertyPath, v.message);
    });
  }
};
</script>
