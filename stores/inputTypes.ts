import { defineStore } from "pinia";
import { mockInputTypes, mockInputType } from "~/mocks/inputTypes"; // Optional for local testing
interface InputType {
  id?: number;
  name?: string;
  // Add more fields as needed
}

export const useInputTypesStore = defineStore("inputTypes", {
  state: () => ({
    inputTypes: [] as InputType[],
    currentInputType: mockInputType, //{} as InputType,
  }),

  actions: {
    setInputTypes(inputTypes: InputType[]) {
      this.inputTypes = inputTypes;
    },

    setCurrentInputType(inputType: InputType) {
      this.currentInputType = inputType;
    },

    resetInputType() {
      this.currentInputType = {} as InputType;
    },

    async loadInputTypes() {
      try {
        this.setInputTypes(mockInputTypes); // TODO: remove in production

        const { data, error } = await useFetch<InputType[]>(
          "/input_types.json"
        );
        if (error.value) throw error.value;

        if (data.value) {
          this.setInputTypes(data.value);
        }
      } catch (err) {
        console.error("Failed to load input types:", err);
      }
    },

    async loadInputType(id: number) {
      this.setCurrentInputType(mockInputType);

      try {
        const { data, error } = await useFetch<InputType>(
          `/input_types/${id}.json`
        );
        if (error.value) throw error.value;

        if (data.value) {
          this.setCurrentInputType(data.value);
        }
      } catch (err) {
        console.error(`Failed to load input type with id ${id}:`, err);
      }
    },

    async updateInputType(inputType: InputType) {
      try {
        const { error } = await useFetch(`/input_types/${inputType.id}`, {
          method: "PUT",
          body: inputType,
        });
        if (error.value) throw error.value;
      } catch (err) {
        console.error("Failed to update input type:", err);
      }
    },

    async postInputType(inputType: Omit<InputType, "id">) {
      try {
        const { error } = await useFetch("/input_types", {
          method: "POST",
          body: inputType,
        });
        if (error.value) throw error.value;
      } catch (err) {
        console.error("Failed to create input type:", err);
      }
    },

    async deleteInputType(inputType: InputType) {
      try {
        const { error } = await useFetch(`/input_types/${inputType.id}`, {
          method: "DELETE",
        });
        if (error.value) throw error.value;

        this.resetInputType();
      } catch (err) {
        console.error("Failed to delete input type:", err);
      }
    },
  },
});
