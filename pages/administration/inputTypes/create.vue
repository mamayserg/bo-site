<template>
  <AdminInputTypesForm
    ref="form"
    title="Create input type"
    :input-type="inputType"
    @submit="createInputType"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useInputTypesStore } from '@/stores/inputTypes';
import { useNotificationStore } from '@/stores/notification';
// import { Roles } from '@/constants/roles';
import AdminInputTypesForm from '@/components/administration/inputTypes/AdminInputTypesForm.vue';
// import { useAuthGuard } from '@/composables/useAuthGuard';

const form = ref(null);
const router = useRouter();

const inputTypesStore = useInputTypesStore();
const notificationStore = useNotificationStore();

const inputType = inputTypesStore.currentInputType;

onMounted(() => {
  inputTypesStore.resetInputType();
});

const createInputType = async (inputType) => {
  try {
    await inputTypesStore.postInputType(inputType);
    notificationStore.success(`Input type "${inputType.name}" created`);
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
