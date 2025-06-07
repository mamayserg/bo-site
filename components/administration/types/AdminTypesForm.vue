<template>
  <div class="space-y-4">
    <Toolbar class="bg-primary text-white">
      <template #start>
        <div class="text-xl font-semibold" data-testid="type-edit-title">
          {{ title }}
        </div>
      </template>
    </Toolbar>

    <Card>
      <template #content>
        <Form
         :key="initialValues?.name"
          :initial-values="initialValues"
          :resolver="resolver"
          @submit="onFormSubmit"
          class="space-y-4"
        >
          <FormField v-slot="$field" name="name" class="mb-4">
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

          <div class="flex items-center gap-2 mt-6">
            <Button
              type="submit"
              label="Submit"
              icon="pi pi-check"
              data-testid="edit-btn"
            />
            <Button
              severity="secondary"
              label="Cancel"
              icon="pi pi-times"
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
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

const props = defineProps({
  title: {
    type: String,
    default: "Type Form",
  },
  type: {
    type: Object as () => { name: string },
    required: true,
    default: { name: '' },
  },
});

const emit = defineEmits(["submit"]);

const router = useRouter();

// Zod validation schema
const schema = z.object({
  name: z.string().min(1, { message: "Name is required." }).max(255),
});

const resolver = zodResolver(schema);

const initialValues = computed(() => ({
  name: props.type?.name || '',
}));

const onFormSubmit = ({ values, valid }: { values: any; valid: boolean }) => {
  if (valid) {
    emit("submit", { ...props.type, ...values });
  }
};

const cancel = () => {
  router.back();
};
</script>
