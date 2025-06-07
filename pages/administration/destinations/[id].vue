<template>
  <AdminDestinationsForm
    ref="form"
    title="Update destination"
    :destination="destination"
    @submit="updateDestination"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AdminDestinationsForm from "~/components/administration/destinations/AdminDestinationsForm.vue";
import { useDestinationsStore } from "~/stores/destinations";
import { useNotificationStore } from "~/stores/notification";
// import { Roles } from "~/constants/roles";

defineOptions({
  name: "AdminDestinationsEdit",
  // middleware: "authenticated",
  // meta: {
  //   authorizedRoles: [Roles.SUPER_ADMIN],
  // },
});

const form = ref();
const router = useRouter();
const route = useRoute();
const destinationsStore = useDestinationsStore();
const notificationStore = useNotificationStore();

const destination = computed(() => destinationsStore.currentDestination);

onMounted(async () => {
  await destinationsStore.loadDestination(Number(route.params.id));
  await destinationsStore.loadDestinations();
});

async function updateDestination(destinationData) {
  try {
    await destinationsStore.updateDestination(destinationData);
    notificationStore.success(
      `Destination "${destination.value.name}" updated`
    );
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
