<template>
  <div class="space-y-4">
    <Toolbar class="bg-primary text-white">
      <template #start>
        <div class="text-xl font-semibold" data-testid="segment-form-title">{{ title }}</div>
      </template>
      <template #end>
        <div v-if="segmentsGroup.updateDate" class="flex items-center gap-2">
          <Chip :label="statusLabel" :severity="statusSeverity" />
          <Button v-if="hasMessage" label="Error detail" @click="showError = true" text />
          <Dialog v-model:visible="showError" modal header="Error detail">
            <p>{{ segmentsGroup.message }}</p>
            <pre class="text-sm text-red-600">{{ segmentsGroup.errorStack }}</pre>
          </Dialog>
          <span class="text-sm">Last update: {{ segmentsGroup.updateDate }}</span>
        </div>
      </template>
    </Toolbar>

    <Card>
      <template #content>
        <Form :initial-values="initialValues" :resolver="zodResolver(schema)" @submit="onSubmit" class="space-y-6">
          <!-- Template Type Buttons -->
          <div class="flex flex-wrap gap-2">
            <Button
              v-for="templateType in templateTypes"
              :key="templateType.id"
              :label="templateType.name"
              :severity="segmentsGroup.templateType?.id === templateType.id ? 'primary' : 'secondary'"
              @click="selectTemplateType(templateType)"
              outlined
              data-testid="template-type-btn"
            />
          </div>

          <div v-if="segmentsGroup.templateType" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-4">
              <FormField name="name" v-slot="{ field, error }">
                <label class="block font-medium">Name</label>
                <InputText v-bind="field" class="w-full" />
                <Message v-if="error" severity="error">{{ error }}</Message>
              </FormField>

              <FormField name="description" v-slot="{ field, error }">
                <label class="block font-medium">Description</label>
                <InputText v-bind="field" class="w-full" />
                <Message v-if="error" severity="error">{{ error }}</Message>
              </FormField>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <InputText :model-value="customer.code" label="Customer" disabled />
              <div class="flex items-center gap-2 pt-2">
                <label>Active</label>
                <InputSwitch v-model="segmentsGroup.active" />
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <CustomSelect
                v-model="segmentsGroup.type"
                label="Type"
                :options="typeOptions"
                option-label="label"
                option-value="value"
                required
              />
              <CustomSelect
                v-model="segmentsGroup.destinations"
                label="Destinations"
                :options="destinationOptions"
                option-label="label"
                option-value="value"
                multiple
                chips
                required
              />
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <CustomSelect
                v-model="segmentsGroup.inputType"
                label="Input Type"
                :options="inputTypeOptions"
                required
              />
              <InputText value="full" label="ComputeType" disabled />
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <FormField name="expectedUsersMin" v-slot="{ field, error }">
                <label class="block font-medium">Expected Users Min</label>
                <InputNumber v-bind="field" class="w-full" />
                <Message v-if="error" severity="error">{{ error }}</Message>
              </FormField>
              <FormField name="expectedUsersMax" v-slot="{ field, error }">
                <label class="block font-medium">Expected Users Max</label>
                <InputNumber v-bind="field" class="w-full" />
                <Message v-if="error" severity="error">{{ error }}</Message>
              </FormField>
            </div>

            <!-- Common Attributes -->
            <div v-if="commonAttributes.length > 0">
              <h2 class="text-lg font-semibold" data-testid="common-attributes-title">Common Attributes</h2>
              <div class="grid md:grid-cols-2 gap-4">
                <FormField
                  v-for="attribute in commonAttributes"
                  :key="attribute.code"
                  :name="`attribute-${attribute.code}`"
                  v-slot="{ field, error }"
                >
                  <label class="block font-medium">{{ attribute.label }}</label>
                  <InputText v-bind="field" :type="attribute.type" class="w-full" />
                  <Message v-if="error" severity="error">{{ error }}</Message>
                </FormField>
              </div>
            </div>

            <template-component
              :segments="segmentsList"
              @update:order="segmentsOrderUpdate"
              :attributes="attributesList"
              :sortable-config="sortableConfig"
            />

            <Button icon="pi pi-plus" label="Add Rule" @click="addSegment" text class="mt-4" />
          </div>

          <!-- Form Actions -->
          <div class="flex gap-2 pt-4">
            <Button type="submit" label="Submit" icon="pi pi-check" data-testid="submit-btn" />
            <Button label="Cancel" icon="pi pi-times" severity="secondary" @click="cancel" data-testid="cancel-btn" />
          </div>
        </Form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';

import TemplateComponent from './Template.vue';
import CustomSelect from '../../commons/CustomSelect.vue';

const props = defineProps<{
  title?: string;
  segmentsGroup: any;
  templateTypes: Array<any>;
}>();

const emit = defineEmits<{
  (e: 'submit', payload: any): void;
}>();

const store = useStore();
const router = useRouter();
const showError = ref(false);

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  expectedUsersMin: z.number().int().optional(),
  expectedUsersMax: z.number().int().optional(),
});

const initialValues = computed(() => ({
  name: props.segmentsGroup.name || '',
  description: props.segmentsGroup.description || '',
  expectedUsersMin: props.segmentsGroup.expectedUsersMin ?? undefined,
  expectedUsersMax: props.segmentsGroup.expectedUsersMax ?? undefined,
}));

const statusLabel = computed(() => {
  return store.getters['segmentsGroups/getStatus'](props.segmentsGroup.status)?.message || '';
});
const statusSeverity = computed(() => {
  return store.getters['segmentsGroups/getStatus'](props.segmentsGroup.status)?.color || 'info';
});
const hasMessage = computed(() => !!props.segmentsGroup.message);
const customer = computed(() => props.segmentsGroup.customer || store.getters['auth/currentCustomer']);

const typeOptions = []; // Populate appropriately
const destinationOptions = []; // Populate appropriately
const inputTypeOptions = []; // Populate appropriately

function selectTemplateType(templateType: any) {
  props.segmentsGroup.templateType = templateType;
  props.segmentsGroup.segments = [];
}

function addSegment() {
  props.segmentsGroup.segments.push({
    name: '',
    value: '',
    description: '',
    sortIndex: props.segmentsGroup.segments.length,
    attributesValues: props.segmentsGroup.templateType.attributes.map((attr: any) => ({
      templateTypeAttribute: attr,
      value: '',
    })),
  });
}

function segmentsOrderUpdate(newSegments: any[]) {
  props.segmentsGroup.segments = newSegments;
}

const commonAttributes = computed(() => {
  return props.segmentsGroup.templateType?.attributes?.filter((attr: any) => attr.common) || [];
});

const attributesList = computed(() => props.segmentsGroup.templateType?.attributes || []);
const segmentsList = computed(() => props.segmentsGroup.segments);

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
    status: 'pending',
    computeType: 1,
  };

  // Set common attribute values to all segments
  commonAttributes.value.forEach(attr => {
    props.segmentsGroup.segments.forEach((segment: any) => {
      const target = segment.attributesValues.find((val: any) => val.templateTypeAttribute.code === attr.code);
      if (target) target.value = attr.value;
    });
  });

  emit('submit', payload);
}

function cancel() {
  router.back();
}
</script>
