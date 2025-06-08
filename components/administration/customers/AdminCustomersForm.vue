<template>
  <div class="space-y-4">
    <Toolbar class="bg-primary text-white">
      <template #start>
        <div class="text-xl font-semibold" data-testid="customer-edit-title">
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
          <!-- Name -->
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

          <!-- Code -->
          <FormField v-slot="$field" name="code">
            <label for="code" class="block mb-1 font-medium">Code</label>
            <InputText
              id="code"
              v-bind="$field"
              :disabled="codeDisabled"
              :class="{ 'p-invalid': $field?.invalid }"
              class="w-full"
              data-testid="code-input"
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

          <!-- Timezone -->
          <FormField v-slot="$field" name="timezone">
            <label for="timezone" class="block mb-1 font-medium">Timezone</label>
            <InputText
              id="timezone"
              v-bind="$field"
              :class="{ 'p-invalid': $field?.invalid }"
              class="w-full"
              data-testid="timezone-input"
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
import { computed, watch } from 'vue'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useRouter } from 'vue-router'

const props = defineProps<{
  title?: string;
  customer: {
    name: string;
    code: string;
    timezone?: string;
  };
  codeDisabled: boolean;
}>()

const emit = defineEmits<{
  (e: 'submit', payload: any): void;
}>()

const router = useRouter()

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  code: z.string().min(1, 'Code is required').max(255),
  timezone: z.string().max(255).optional()
})

const resolver = zodResolver(schema)

// Replace Slugify with a native function
function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove invalid chars
    .replace(/\s+/g, '-')     // collapse whitespace and replace with -
    .replace(/-+/g, '-')      // collapse dashes
}

const initialValues = computed(() => ({
  name: props.customer.name || '',
  code: props.codeDisabled
    ? props.customer.code || ''
    : generateSlug(props.customer.name || ''),
  timezone: props.customer.timezone || ''
}))

const onFormSubmit = ({ values, valid }: { values: any; valid: boolean }) => {
  if (!valid) return
  emit('submit', { ...props.customer, ...values })
}

const cancel = () => {
  router.back()
}
</script>
