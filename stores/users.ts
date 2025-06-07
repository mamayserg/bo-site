import { defineStore } from 'pinia';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Customer {
  id: number;
  name: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    customers: [] as Customer[],
    currentUser: {} as User,
    owners: [] as User[],
  }),

  actions: {
    async loadUsers() {
      const { data, error } = await useFetch<User[]>('/users.json');
      if (error.value) {
        // eslint-disable-next-line no-console
        console.error('Failed to load users:', error.value);

        return;
      }
      if (data.value) {
        this.users = data.value;
      }
    },

    async loadCustomers() {
      const { data, error } = await useFetch<Customer[]>('/customers.json');
      if (error.value) {
        // eslint-disable-next-line no-console
        console.error('Failed to load customers:', error.value);

        return;
      }
      if (data.value) {
        this.customers = data.value;
      }
    },

    async loadUser(id: number) {
      const { data, error } = await useFetch<User>(`/users/${id}.json`);
      if (error.value) {
        // eslint-disable-next-line no-console
        console.error('Failed to load user:', error.value);

        return;
      }
      if (data.value) {
        this.currentUser = data.value;
      }
    },

    resetUser() {
      this.currentUser = {} as User;
    },

    async loadOwnersList(filters: Record<string, any> = {}) {
      const { data, error } = await useFetch<User[]>('/users.json', {
        params: filters,
      });
      if (error.value) {
        // eslint-disable-next-line no-console
        console.error('Failed to load owners list:', error.value);

        return;
      }
      if (data.value) {
        this.owners = data.value;
      }
    },

    async putUser(user: User) {
      const { data, error } = await useFetch<User>(`/users/${user.id}`, {
        method: 'PUT',
        body: user,
      });
      if (error.value) {
        // eslint-disable-next-line no-console
        console.error('Failed to update user:', error.value);

        return;
      }
      if (data.value) {
        this.currentUser = data.value;
      }
    },
  },
});
