<template>
  <AdminDestinationsForm
    ref="form"
    title="Create destination"
    :destination="destination"
    @submit="createDestination"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AdminDestinationsForm from "~/components/administration/destinations/AdminDestinationsForm.vue";
import { useDestinationsStore } from "~/stores/destinations";
import { useNotificationStore } from "~/stores/notification";
// import { Roles } from '~/constants/roles'

defineOptions({
  name: "AdminDestinationsAdd",
  // middleware: 'authenticated',
  // meta: {
  //   authorizedRoles: [Roles.SUPER_ADMIN]
  // }
});

const form = ref();
const router = useRouter();
const destinationsStore = useDestinationsStore();
const notificationStore = useNotificationStore();

const destination = computed(() => destinationsStore.currentDestination);

onMounted(() => {
  destinationsStore.resetDestination();
});

async function createDestination(destinationData) {
  try {
    await destinationsStore.postDestination(destinationData);
    notificationStore.success(`Destination "${destinationData.name}" created`);
    router.push("/administration/destinations");
  } catch (error) {
    notificationStore.error();
    if (error?.response?.data?.violations) {
      error.response.data.violations.forEach((violation) => {
        form.value?.addError(violation.propertyPath, violation.message);
      });
    }
  }
}
</script>
