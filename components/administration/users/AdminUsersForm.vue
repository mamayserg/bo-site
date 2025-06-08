<template>
  <div class="space-y-4">
    <Toolbar class="bg-primary text-white">
      <template #start>
        <div class="text-xl font-semibold" data-testid="user-edit-title">{{ title }}</div>
      </template>
    </Toolbar>

    <Card>
      <template #content>
        <Form
          :key="initialValues.username"
          :initial-values="initialValues"
          :resolver="resolver"
          @submit="onFormSubmit"
          class="space-y-4"
        >
          <!-- Username -->
          <FormField v-slot="$field" name="username">
            <label for="username" class="block mb-1 font-medium">Username</label>
            <InputText
              id="username"
              v-bind="$field"
              class="w-full"
              disabled
              data-testid="username-input"
            />
          </FormField>

          <!-- First name -->
          <FormField v-slot="$field" name="firstName">
            <label for="firstName" class="block mb-1 font-medium">First Name</label>
            <InputText
              id="firstName"
              v-bind="$field"
              class="w-full"
              data-testid="first-name-input"
              :class="{ 'p-invalid': $field?.invalid }"
            />
            <Message v-if="$field?.invalid" severity="error">{{ $field.error?.message }}</Message>
          </FormField>

          <!-- Last name -->
          <FormField v-slot="$field" name="lastName">
            <label for="lastName" class="block mb-1 font-medium">Last Name</label>
            <InputText
              id="lastName"
              v-bind="$field"
              class="w-full"
              data-testid="last-name-input"
              :class="{ 'p-invalid': $field?.invalid }"
            />
            <Message v-if="$field?.invalid" severity="error">{{ $field.error?.message }}</Message>
          </FormField>

          <!-- Email -->
          <FormField v-slot="$field" name="email">
            <label for="email" class="block mb-1 font-medium">Email</label>
            <InputText
              id="email"
              v-bind="$field"
              class="w-full"
              data-testid="email-input"
              :class="{ 'p-invalid': $field?.invalid }"
            />
            <Message v-if="$field?.invalid" severity="error">{{ $field.error?.message }}</Message>
          </FormField>

          <!-- Super Admin toggle -->
          <div class="flex items-center gap-2">
            <InputSwitch v-model="superAdmin" input-id="super-admin-switch" @change="onSuperAdminChange" />
            <label for="super-admin-switch" class="font-medium">Super Admin</label>
          </div>

          <!-- Roles -->
          <FormField v-if="!superAdmin" v-slot="$field" name="roles">
            <label for="roles" class="block mb-1 font-medium">Roles</label>
            <MultiSelect
              id="roles"
              v-bind="$field"
              :options="roles"
              option-label="label"
              option-value="key"
              display="chip"
              class="w-full"
              placeholder="Select roles"
              data-testid="roles-select"
            />
            <Message v-if="$field?.invalid" severity="error">{{ $field.error?.message }}</Message>
          </FormField>

          <!-- API Key -->
          <FormField v-slot="$field" name="apiKey">
            <label for="apiKey" class="block mb-1 font-medium">API Key</label>
            <div class="flex gap-2">
              <InputText
                id="apiKey"
                v-bind="$field"
                class="w-full"
                data-testid="api-key-input"
                :class="{ 'p-invalid': $field?.invalid }"
              />
              <Button icon="pi pi-refresh" @click="generateApiKey" severity="info" />
            </div>
            <Message v-if="$field?.invalid" severity="error">{{ $field.error?.message }}</Message>
          </FormField>

          <!-- Customers table -->
          <div>
            <h3 class="font-semibold mb-2">Associated Customers</h3>
            <div v-for="customer in customers" :key="customer.id" class="flex items-center gap-2">
              <Checkbox
                :input-id="'customer-' + customer.id"
                :value="customer.id"
                v-model="selectedCustomerIds"
              />
              <label :for="'customer-' + customer.id">{{ customer.name }}</label>
            </div>
          </div>

          <!-- Actions -->
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
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Roles } from '@/constants/roles';

const props = defineProps<{
  title?: string;
  user: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    apiKey: string;
    roles: string[];
    customers: { id: number; name: string }[];
  };
  customers: { id: number; name: string }[];
}>();

const emit = defineEmits<{
  (e: 'submit', payload: { user: any }): void;
}>();

const router = useRouter();
const superAdmin = ref(false);
const selectedCustomerIds = ref<number[]>([]);

watch(
  () => props.user.roles,
  (roles) => {
    superAdmin.value = roles.includes(Roles.SUPER_ADMIN);
  },
  { immediate: true }
);

const roles = [
  { key: Roles.DATA_ADVANCED, label: 'Data user advanced' },
  { key: Roles.DATA_BEGINNER, label: 'Data user' },
  { key: Roles.USER_MANAGER, label: 'User manager' }
];

const schema = z.object({
  username: z.string(),
  firstName: z.string().min(1, 'First name is required').max(255),
  lastName: z.string().min(1, 'Last name is required').max(255),
  email: z.string().email('Invalid email').max(255),
  roles: z.array(z.string()).optional(),
  apiKey: z.string().min(1, 'API key is required').max(255)
});

const resolver = zodResolver(schema);

const initialValues = computed(() => ({
  username: props.user.username,
  firstName: props.user.firstName,
  lastName: props.user.lastName,
  email: props.user.email,
  roles: props.user.roles,
  apiKey: props.user.apiKey
}));

function onSuperAdminChange(val: boolean) {
  if (val) {
    initialValues.value.roles = [Roles.SUPER_ADMIN];
  } else {
    initialValues.value.roles = [];
  }
}

function generateApiKey() {
  const newKey = Math.random().toString(36).substring(2);
  initialValues.value.apiKey = newKey;
}

function onFormSubmit({ values, valid }: { values: any; valid: boolean }) {
  if (!valid) return;
    // roles: superAdmin.value ? [Roles.SUPER_ADMIN] : values.roles || [],

  const updatedUser = {
    ...props.user,
    ...values,
    roles: superAdmin.value ,
    customers: props.customers
      .filter((c) => selectedCustomerIds.value.includes(c.id))
      .map((c) => `/customers/${c.id}`)
  };

  emit('submit', { user: updatedUser });
}

function cancel() {
  router.back();
}
</script>
