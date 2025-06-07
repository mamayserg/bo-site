import { defineStore } from "pinia";
import { mockTypes } from '~/mocks/types';

interface TypeItem {
  id: number;
  name: string;
  // Add more fields as necessary
}

export const useTypesStore = defineStore("types", {
  state: () => ({
    types: [] as TypeItem[],
    currentType: {} as TypeItem,
  }),

  actions: {
    async loadTypes() {
      this.types = mockTypes // TODO remove it
      const { data, error } = await useFetch<TypeItem[]>("/types.json");
      if (error.value) {
        // eslint-disable-next-line no-console
        console.error("Failed to load types:", error.value);

        return;
      }
      if (data.value) {
        this.types = data.value;
      }
    },

    async loadType(id: number) {
      const { data, error } = await useFetch<TypeItem>(`/types/${id}.json`);
      if (error.value) {
        // eslint-disable-next-line no-console
        console.error("Failed to load type:", error.value);

        return;
      }
      if (data.value) {
        this.currentType = data.value;
      }
    },

    async updateType(type: TypeItem) {
      const { error } = await useFetch(`/types/${type.id}`, {
        method: "PUT",
        body: type,
      });
      if (error.value) {
        // eslint-disable-next-line no-console
        console.error("Failed to update type:", error.value);
      }
    },

    async postType(type: Omit<TypeItem, "id">) {
      const { error } = await useFetch("/types", {
        method: "POST",
        body: type,
      });
      if (error.value) {
        // eslint-disable-next-line no-console
        console.error("Failed to create type:", error.value);
      }
    },

    async deleteType(type: TypeItem) {
      const { error } = await useFetch(`/types/${type.id}`, {
        method: "DELETE",
      });
      if (error.value) {
        // eslint-disable-next-line no-console
        console.error("Failed to delete type:", error.value);

        return;
      }
      this.resetType();
    },

    resetType() {
      this.currentType = {} as TypeItem;
    },
  },
});
