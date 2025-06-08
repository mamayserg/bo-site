<template>
  <div class="space-y-6">
    <Toolbar class="bg-primary text-white">
      <template #start>
        <div class="text-xl font-semibold" data-testid="segment-form-title">{{ title }}</div>
      </template>
    </Toolbar>

    <Card>
      <template #content>
        <Form :initial-values="initialValues" :resolver="zodResolver(schema)" @submit="onSubmit" class="space-y-6">

          <FormField v-slot="{ field, error }" name="name">
            <label for="name" class="block font-medium mb-1">Name</label>
            <InputText id="name" v-bind="field" class="w-full" :class="{ 'p-invalid': !!error }" />
            <Message v-if="error" severity="error">{{ error }}</Message>
          </FormField>

          <FormField v-slot="{ field, error }" name="description">
            <label for="description" class="block font-medium mb-1">Description</label>
            <InputText id="description" v-bind="field" class="w-full" :class="{ 'p-invalid': !!error }" />
            <Message v-if="error" severity="error">{{ error }}</Message>
          </FormField>

          <div class="grid grid-cols-2 gap-4">
            <FormField v-slot="{ field }" name="customer">
              <label class="block font-medium mb-1">Customer</label>
              <InputText v-bind="field" :value="customer.code" disabled class="w-full" />
            </FormField>

            <FormField v-slot="{ field }" name="active">
              <label class="block font-medium mb-1">Active</label>
              <InputSwitch v-bind="field" />
            </FormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormField v-slot="{ field, error }" name="expectedUsersMax">
              <label for="expectedUsersMax" class="block font-medium mb-1">Expected Users Max</label>
              <InputNumber id="expectedUsersMax" v-bind="field" class="w-full" :class="{ 'p-invalid': !!error }" />
              <Message v-if="error" severity="error">{{ error }}</Message>
            </FormField>

            <FormField v-slot="{ field, error }" name="expectedUsersMin">
              <label for="expectedUsersMin" class="block font-medium mb-1">Expected Users Min</label>
              <InputNumber id="expectedUsersMin" v-bind="field" class="w-full" :class="{ 'p-invalid': !!error }" />
              <Message v-if="error" severity="error">{{ error }}</Message>
            </FormField>
          </div>

          <FormField v-slot="{ field, error }" name="fullQuery">
            <label for="fullQuery" class="block font-medium mb-1">Full Query</label>
            <Textarea id="fullQuery" v-bind="field" rows="4" class="w-full" :class="{ 'p-invalid': !!error }" />
            <Message v-if="error" severity="error">{{ error }}</Message>
          </FormField>

          <FormField v-slot="{ field }" name="incrementalQuery">
            <label for="incrementalQuery" class="block font-medium mb-1">Incremental Query</label>
            <Textarea id="incrementalQuery" v-bind="field" rows="4" class="w-full" />
          </FormField>

          <Message severity="warn">
            The segment you are creating contains personal data as defined by the GDPR. The processing of these data may require the data subject's consent. Please refer to documentation or consult a data protection officer.
          </Message>

          <div class="flex gap-2 pt-4">
            <Button type="submit" label="Submit" icon="pi pi-check" class="p-button-success" />
            <Button label="Cancel" icon="pi pi-times" severity="secondary" @click="cancel" />
          </div>

        </Form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const props = defineProps<{
  title?: string;
  segmentsGroup: any;
}>();

const emit = defineEmits<{
  (e: 'submit', payload: any): void;
}>();

const router = useRouter();
const store = useStore();

const customer = computed(() => props.segmentsGroup.customer || store.getters['auth/currentCustomer']);

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  expectedUsersMax: z.number().optional(),
  expectedUsersMin: z.number().optional(),
  fullQuery: z.string().min(1, 'Full query is required'),
  incrementalQuery: z.string().optional(),
  active: z.boolean().optional(),
});

const initialValues = computed(() => ({
  name: props.segmentsGroup.name || '',
  description: props.segmentsGroup.description || '',
  expectedUsersMax: props.segmentsGroup.expectedUsersMax || null,
  expectedUsersMin: props.segmentsGroup.expectedUsersMin || null,
  fullQuery: props.segmentsGroup.fullQuery || '',
  incrementalQuery: props.segmentsGroup.incrementalQuery || '',
  active: props.segmentsGroup.active || false,
}));

function onSubmit({ values, valid }: { values: any; valid: boolean }) {
  if (!valid) {
    store.dispatch('notification/warning', 'Field(s) are not valid.');
    return;
  }
  const payload = {
    ...props.segmentsGroup,
    ...values,
    customer: customer.value,
    owner: store.getters['auth/infos'].id,
    status: 'pending'
  };
  emit('submit', payload);
}

function cancel() {
  router.back();
}
</script>
