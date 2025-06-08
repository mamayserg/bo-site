<template>
  <div class="space-y-4">
    <Toolbar class="bg-primary text-white">
      <template #start>
        <div
          class="text-xl font-semibold"
          data-testid="input-type-edit-title"
        >
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
          class="space-y-6"
        >
          <!-- Name Field -->
          <FormField v-slot="$field" name="name">
            <label for="name" class="block mb-1 font-medium">Name</label>
            <InputText
              id="name"
              v-bind="$field"
              :class="{ 'p-invalid': $field?.invalid }"
              class="w-full"
              data-testid="name-input"
              maxlength="255"
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
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useNotificationStore } from '@/stores/notification';
import { useAuthStore } from '@/stores/auth';

// Props
const props = defineProps<{
  title?: string;
  inputType: {
    name: string;
    customer?: any;
  };
}>();

const emit = defineEmits<{
  (e: 'submit', payload: any): void;
}>();

const router = useRouter();
const authStore = useAuthStore();
const notification = useNotificationStore();

// Schema
const schema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }).max(255),
});
const resolver = zodResolver(schema);

// Initial form values
const initialValues = computed(() => ({
  name: props.inputType?.name || '',
}));

// Submit handler
const onFormSubmit = ({ values, valid }: { values: any; valid: boolean }) => {
  if (!valid) {
    notification.warning('Field(s) are not valid.');
    return;
  }

  const payload = {
    ...props.inputType,
    ...values,
    customer: authStore.currentCustomer,
  };

  emit('submit', payload);
};

// Cancel navigation
const cancel = () => {
  router.back();
};
</script>
