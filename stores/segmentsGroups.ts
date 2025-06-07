import { defineStore } from 'pinia'

interface Segment {
  name: string
  value: string
  description: string
}

interface SegmentsGroup {
  id?: number
  segments: Segment[]
  [key: string]: any
}

interface StatusItem {
  id: string
  label: string
  message: string
  color: string
}

export const useSegmentsGroupStore = defineStore('segmentsGroup', {
  state: () => ({
    currentSegmentsGroup: {
      segments: [] as Segment[],
    } as SegmentsGroup,

    segmentsGroupList: [] as SegmentsGroup[],
    types: [] as any[],
    inputsTypes: [] as any[],
    computeTypes: [] as any[],
    destinations: [] as any[],

    status: [
      { id: 'success', label: 'Success', message: 'Validated', color: 'success' },
      { id: 'pending', label: 'Pending', message: 'Pending validation', color: 'warning' },
      { id: 'error_create', label: 'Error create', message: 'Error: your segment cannot be created', color: 'error' },
      { id: 'error_update', label: 'Error update', message: 'Error: your change isn\'t valid, we will keep using previous version.', color: 'error' },
    ] as StatusItem[],
  }),

  getters: {
    getStatus: (state) => (statusId: string) => {
      return state.status.find(s => s.id === statusId)
    },
  },

  actions: {
    setFreshSegmentGroup() {
      this.currentSegmentsGroup = {
        segments: [{
          name: '',
          value: '',
          description: '',
        }],
      }
    },

    setFreshSegment() {
      this.currentSegmentsGroup = { segments: [] }
    },

    setCurrentSegmentsGroup(group: SegmentsGroup) {
      this.currentSegmentsGroup = group
    },

    updateSegmentsGroup(group: SegmentsGroup) {
      this.currentSegmentsGroup = group
    },

    setTypes(types: any[]) {
      this.types = types
    },

    setInputTypes(types: any[]) {
      this.inputsTypes = types
    },

    setComputeTypes(types: any[]) {
      this.computeTypes = types
    },

    setDestinations(destinations: any[]) {
      this.destinations = destinations
    },

    setSegmentsGroupList(groups: SegmentsGroup[]) {
      this.segmentsGroupList = groups
    },

    async loadTypes() {
      const { data, error } = await useFetch('/types.json')
      if (data.value) this.setTypes(data.value)
      if (error.value) console.error('Failed to load types:', error.value)
    },

    async loadInputTypes() {
      const { data, error } = await useFetch('/input_types.json')
      if (data.value) this.setInputTypes(data.value)
      if (error.value) console.error('Failed to load input types:', error.value)
    },

    async loadComputeTypes() {
      const { data, error } = await useFetch('/compute_types.json')
      if (data.value) this.setComputeTypes(data.value)
      if (error.value) console.error('Failed to load compute types:', error.value)
    },

    async loadDestinations() {
      const { data, error } = await useFetch('/destinations.json')
      if (data.value) this.setDestinations(data.value)
      if (error.value) console.error('Failed to load destinations:', error.value)
    },

    async resetSegmentsGroup() {
      this.setFreshSegmentGroup()
    },

    async resetSegment() {
      this.setFreshSegment()
    },

    async loadSegmentsGroup(id: number) {
      const { data, error } = await useFetch(`/segments_groups/${id}.json`)
      if (data.value) this.setCurrentSegmentsGroup(data.value)
      if (error.value) console.error('Failed to load segment group:', error.value)
    },

    async putSegmentsGroup(group: SegmentsGroup) {
      const { data, error } = await useFetch(`/segments_groups/${group.id}`, {
        method: 'PUT',
        body: group,
      })
      if (data.value) this.updateSegmentsGroup(data.value)
      if (error.value) console.error('Failed to update segment group:', error.value)
    },

    async postSegmentsGroup(group: SegmentsGroup) {
      const { data, error } = await useFetch(`/segments_groups`, {
        method: 'POST',
        body: group,
      })
      if (data.value) this.setCurrentSegmentsGroup(data.value)
      if (error.value) console.error('Failed to create segment group:', error.value)
    },

    async loadSegmentsGroups(filters?: any) {
      const { data, error } = await useFetch('/segments_groups.json', {
        params: filters,
      })
      if (data.value) this.setSegmentsGroupList(data.value)
      if (error.value) console.error('Failed to load segments group list:', error.value)
    },
  },
})
