import { defineStore } from 'pinia';
import { mockCustomers } from '~/mocks/customers';

interface Customer {
  id?: number
  name?: string
  email?: string
  // Add more fields as needed
}

export const useCustomersStore = defineStore('customers', {
  state: () => ({
    customers: [] as Customer[],
    currentCustomer: {} as Customer,
  }),

  actions: {
    setCustomers(customers: Customer[]) {
      this.customers = customers;
    },

    setCurrentCustomer(customer: Customer) {
      this.currentCustomer = customer;
    },

    resetCustomer() {
      this.currentCustomer = {} as Customer;
    },

    async loadCustomers() {
      try {
        this.setCustomers(mockCustomers); // TODO: Remove mock in production

        const { data, error } = await useFetch<Customer[]>('/customers.json');
        if (error.value) throw error.value;

        if (data.value) {
          this.setCustomers(data.value);
        }
      } catch (err) {
        console.error('Failed to load customers:', err);
      }
    },

    async loadCustomer(id: number) {
      try {
        const { data, error } = await useFetch<Customer>(`/customers/${id}.json`);
        if (error.value) throw error.value;

        if (data.value) {
          this.setCurrentCustomer(data.value);
        }
      } catch (err) {
        console.error(`Failed to load customer with id ${id}:`, err);
      }
    },

    async updateCustomer(customer: Customer) {
      try {
        const { error } = await useFetch(`/customers/${customer.id}`, {
          method: 'PUT',
          body: customer,
        });
        if (error.value) throw error.value;
      } catch (err) {
        console.error('Failed to update customer:', err);
      }
    },

    async postCustomer(customer: Omit<Customer, 'id'>) {
      try {
        const { error } = await useFetch('/customers', {
          method: 'POST',
          body: customer,
        });
        if (error.value) throw error.value;
      } catch (err) {
        console.error('Failed to create customer:', err);
      }
    },
  },
});
