<template>
  <div class="space-y-4">
    <Toolbar class="bg-primary text-white">
      <template #start>
        <div class="text-xl font-semibold" data-testid="destination-edit-title">
          {{ title }}
        </div>
      </template>
    </Toolbar>

    <Card>
      <template #content>
        <Form
          :key="initialValues.name"
          :initial-values="initialValues"
          :resolver="resolver"
          @submit="onFormSubmit"
          class="space-y-4"
        >
          <!-- Name field -->
          <FormField v-slot="$field" name="name">
            <label for="name" class="block mb-1 font-medium">Name</label>
            <InputText
              id="name"
              v-bind="$field"
              :class="{ 'p-invalid': $field?.invalid }"
              class="w-full"
              data-testid="name-input"
            />
            <Message
              v-if="$field?.invalid"
              severity="error"
              size="small"
              class="p-error"
            >
              {{ $field.error?.message }}
            </Message>
          </FormField>

          <!-- Actions -->
          <div class="flex gap-2 pt-4">
            <Button
              type="submit"
              label="Submit"
              icon="pi pi-check"
              data-testid="edit-btn"
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              @click="cancel"
              data-testid="cancel-btn"
            />
          </div>
        </Form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from "vue";
import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { useAuthStore } from "@/stores/auth"; 

const props = defineProps<{
  title?: string;
  destination: {
    name: string;
    customer?: any;
  };
}>();

const emit = defineEmits<{
  (e: "submit", payload: any): void;
}>();

const router = useRouter();
const authStore = useAuthStore(); // replace with your actual auth Pinia store

const schema = z.object({
  name: z.string().min(1, "Name is required").max(255),
});

const resolver = zodResolver(schema);

const initialValues = computed(() => ({
  name: props.destination?.name || "",
}));

const onFormSubmit = ({ values, valid }: { values: any; valid: boolean }) => {
  if (!valid) return;

  const enrichedDestination = {
    ...props.destination,
    ...values,
    customer: authStore.currentCustomer,
  };

  emit("submit", enrichedDestination);
};

const cancel = () => {
  router.back();
};
</script>
