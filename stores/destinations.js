import { defineStore } from 'pinia'
import {mockDestinations} from '~/mocks/destinations';

interface Destination {
  id?: number
  name?: string
  // add more fields as needed
}

export const useDestinationsStore = defineStore('destinations', {
  state: () => ({
    destinations: [] as Destination[],
    currentDestination: {} as Destination,
  }),

  actions: {
    setDestinations(destinations: Destination[]) {
      this.destinations = destinations
    },

    setCurrentDestination(destination: Destination) {
      this.currentDestination = destination
    },

    resetDestination() {
      this.currentDestination = {} as Destination
    },

    async loadDestinations() {
      const { data, error } = await useFetch<Destination[]>('/destinations.json')
      if (error.value) {
        console.error('Failed to load destinations:', error.value)
        return
      }
      if (data.value) {
        this.setDestinations(data.value)
      }
    },

    async loadDestination(id: number) { 
       this.setCurrentDestination(mockDestinations) //TODO remove it 
      const { data, error } = await useFetch<Destination>(`/destinations/${id}.json`)
      if (error.value) {
        console.error(`Failed to load destination with id ${id}:`, error.value)
        return
      }
      if (data.value) {
        this.setCurrentDestination(data.value)
      }
    },

    async updateDestination(destination: Destination) {
      const { error } = await useFetch(`/destinations/${destination.id}`, {
        method: 'PUT',
        body: destination,
      })
      if (error.value) {
        console.error('Failed to update destination:', error.value)
      }
    },

    async postDestination(destination: Destination) {
      const { error } = await useFetch('/destinations', {
        method: 'POST',
        body: destination,
      })
      if (error.value) {
        console.error('Failed to create destination:', error.value)
      }
    },

    async deleteDestination(destination: Destination) {
      const { error } = await useFetch(`/destinations/${destination.id}`, {
        method: 'DELETE',
      })
      if (error.value) {
        console.error('Failed to delete destination:', error.value)
        return
      }
      this.resetDestination()
    },
  },
})
