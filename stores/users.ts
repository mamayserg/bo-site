import { defineStore } from "pinia";
import { mockUsers, mockCustomers, mockUser } from '~/mocks/users';

interface Customer {
  id: number;
  name: string;
}
interface User {
  id: number
  name: string
  email: string
}

export const useUsersStore = defineStore("user", {
  state: () => ({
    users: [] as User[],
    customers: [] as Customer[],
    currentUser: {} as User,
    owners: [] as User[],
  }),

  actions: {
    setUsers(users: User[]) {
      this.users = users;
    },

    setCustomers(customers: Customer[]) {
      this.customers = customers;
    },

    setCurrentUser(user: User) {
      this.currentUser = user;
    },

    resetUser() {
      this.currentUser = {} as User;
    },

    getOwnersList(owners: User[]) {
      this.owners = owners;
    },

    updateUserInState(user: User) {
      this.currentUser = user;
    },

    async loadUsers() {
      this.setUsers(mockUsers);
      try {
        const { data, error } = await useFetch<User[]>("/users.json");
        if (error.value) throw error.value;
        if (data.value) this.setUsers(data.value);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    },

    async loadCustomers() {
      this.setCustomers(mockCustomers);
      try {
        const { data, error } = await useFetch<Customer[]>("/customers.json");
        if (error.value) throw error.value;
        if (data.value) this.setCustomers(data.value);
      } catch (err) {
        console.error("Failed to load customers:", err);
      }
    },

    async loadUser(id: number | string) {
      this.setCurrentUser(mockUser)
      try {
        const { data, error } = await useFetch<User>(`/users/${id}.json`);
        if (error.value) throw error.value;
        if (data.value) this.setCurrentUser(data.value);
      } catch (err) {
        console.error(`Failed to load user with ID ${id}:`, err);
      }
    },

    async updateUser(user: User) {
      try {
        await useFetch(`/users/${user.id}`, {
          method: "PUT",
          body: user,
        });
        // Note: This does not update state; call loadUser if needed
      } catch (err) {
        console.error("Failed to update user:", err);
      }
    },

    async putUser(user: User) {
      try {
        const { data, error } = await useFetch<User>(`/users/${user.id}`, {
          method: "PUT",
          body: user,
        });
        if (error.value) throw error.value;
        if (data.value) this.updateUserInState(data.value);
      } catch (err) {
        console.error("Failed to put user:", err);
      }
    },

    async loadOwnersList(filters: Record<string, any> = {}) {
      try {
        const { data, error } = await useFetch<User[]>("/users.json", {
          params: filters,
        });
        if (error.value) throw error.value;
        if (data.value) this.getOwnersList(data.value);
      } catch (err) {
        console.error("Failed to load owners list:", err);
      }
    },
  },
});
