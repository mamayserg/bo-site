<template>
  <div class="space-y-4">
    <Toolbar class="bg-primary text-white">
      <template #start>
        <div
          class="text-xl font-semibold"
          data-testid="template-type-edit-title"
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
          class="space-y-4"
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

          <!-- Attribute Search -->
          <div>
            <InputText
              v-model="search"
              placeholder="Search attributes"
              @input="onSearch"
              data-testid="search-input"
              class="w-full"
            />
            <div v-if="filteredAttributes.length" class="mt-2 space-y-1">
              <div
                v-for="attr in filteredAttributes"
                :key="attr.id"
                class="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <div>
                  <div class="font-medium">{{ attr.label }}</div>
                  <div class="text-sm text-gray-600">{{ attr.type }}</div>
                </div>
                <Button
                  icon="pi pi-plus"
                  label="Add"
                  @click="addAttribute(attr)"
                  data-testid="add-btn"
                  size="small"
                />
              </div>
            </div>
          </div>

          <!-- Selected Attributes Table -->
          <div v-if="templateType.attributes?.length" class="mt-6">
            <h3 class="text-lg font-semibold mb-2">Selected Attributes</h3>
            <DataTable :value="templateType.attributes">
              <Column field="label" header="Label" />
              <Column field="code" header="Code" />
              <Column field="type" header="Type" />
              <Column field="required" header="Required" />
              <Column header="Actions">
                <template #body="{ data }">
                  <Button
                    icon="pi pi-link"
                    severity="danger"
                    @click="removeAttribute(data)"
                    data-testid="unlink-btn"
                    size="small"
                  />
                </template>
              </Column>
            </DataTable>
          </div>

          <!-- Form Buttons -->
          <div class="flex gap-2 mt-6">
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
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useTemplateTypesStore } from "@/stores/templateTypes";

// Props
const props = defineProps({
  title: {
    type: String,
    default: "Template type form",
  },
  templateType: {
    type: Object as () => {
      id?: number;
      name: string;
      attributes: any[];
    },
    required: true,
  },
  attributesToUpdate: {
    type: Array as () => any[],
    default: () => [],
  },
});

const emit = defineEmits(["submit"]);
const router = useRouter();
const store = useTemplateTypesStore();

// Form validation schema
const schema = z.object({
  name: z.string().min(1, { message: "Name is required." }).max(255),
});
const resolver = zodResolver(schema);

const initialValues = computed(() => ({
  name: props.templateType?.name || "",
}));

// Computed: available attributes not linked to any templateType
const attributesList = computed(() =>
  store.attributes.filter((attr) => attr.templateType === null)
);

// Search logic
const search = ref("");
const filteredAttributes = ref<any[]>([]);

const onSearch = () => {
  filteredAttributes.value = attributesList.value.filter((attr) =>
    attr.label.toLowerCase().includes(search.value.toLowerCase())
  );
};

// Add attribute
const addAttribute = (attr: any) => {
  if (!props.templateType.attributes.find((a) => a.id === attr.id)) {
    attr.templateType = props.templateType.id;
    props.templateType.attributes.push(attr);
  }

  if (!props.attributesToUpdate.find((a) => a.id === attr.id)) {
    props.attributesToUpdate.push(attr);
  }

  search.value = "";
  filteredAttributes.value = [];
};

// Remove attribute
const removeAttribute = (attr: any) => {
  attr.templateType = null;
  props.templateType.attributes = props.templateType.attributes.filter(
    (a) => a.id !== attr.id
  );

  if (!props.attributesToUpdate.find((a) => a.id === attr.id)) {
    props.attributesToUpdate.push(attr);
  }
};

// Form submission
const onFormSubmit = ({ values, valid }: { values: any; valid: boolean }) => {
  if (!valid) return;

  emit(
    "submit",
    { ...props.templateType, ...values },
    props.attributesToUpdate
  );
};

// Cancel navigation
const cancel = () => {
  router.back();
};
</script>
