import { defineStore } from 'pinia'
import { mockTemplateTypes, attributes } from '~/mocks/templateTypes';

interface Attribute {
  id: number
  name: string
  // Add more fields as needed
}

interface TemplateType {
  id: number
  name: string
  // Add more fields as needed
}

export const useTemplateTypesStore = defineStore('templateTypes', {
  state: () => ({
    attributes: [] as Attribute[],
    templateTypes: [] as TemplateType[],
    currentTemplateType: {} as TemplateType,
  }),

  actions: {
    // Direct state mutation method equivalent to setAttributes
    updateAttributes(attributes: Attribute[]) {
      this.attributes = attributes
    },

    // GET /template_type_attributes.json
    async loadAttributes() {
       this.attributes =  attributes  //TODO remove it 
      const { data, error } = await useFetch<Attribute[]>('/template_type_attributes.json')

      if (error.value) {
        console.error('Failed to load attributes:', error.value)
        return
      }

      if (data.value) {
        this.attributes = data.value
      }
    },

    // GET /template_types.json
    async loadTemplateTypes() {
      this.templateTypes = mockTemplateTypes //TODO remove it 
      const { data, error } = await useFetch<TemplateType[]>('/template_types.json')

      if (error.value) {
        console.error('Failed to load template types:', error.value)
        return
      }

      if (data.value) {
        this.templateTypes = data.value
      }
    },

    // GET /template_types/:id.json
    async loadTemplateType(id: number) {
      const { data, error } = await useFetch<TemplateType>(`/template_types/${id}.json`)

      if (error.value) {
        console.error(`Failed to load template type with id ${id}:`, error.value)
        return
      }

      if (data.value) {
        this.currentTemplateType = data.value
      }
    },

    // PUT /template_types/:id
    async updateTemplateType(templateType: TemplateType) {
      const { error } = await useFetch(`/template_types/${templateType.id}`, {
        method: 'PUT',
        body: templateType,
      })

      if (error.value) {
        console.error('Failed to update template type:', error.value)
      }
    },

    // PUT /template_type_attributes/:id
    async updateAttribute(attribute: Attribute) {
      const { error } = await useFetch(`/template_type_attributes/${attribute.id}`, {
        method: 'PUT',
        body: attribute,
      })

      if (error.value) {
        console.error('Failed to update attribute:', error.value)
      }
    },

    // Equivalent of resetTemplateType mutation
    resetTemplateType() {
      this.currentTemplateType = {} as TemplateType
    },

    // DELETE /template_types/:id
    async deleteTemplateType(templateType: TemplateType) {
      const { error } = await useFetch(`/template_types/${templateType.id}`, {
        method: 'DELETE',
      })

      if (error.value) {
        console.error('Failed to delete template type:', error.value)
        return
      }

      this.resetTemplateType()
    },
  },
})
