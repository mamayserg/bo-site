import { defineStore } from 'pinia'

interface SegmentGroupLog {
  id: number
  message: string
  createdAt: string
  // Add more fields if necessary
}

export const useSegmentsGroupLogsStore = defineStore('segmentsGroupLogs', {
  state: () => ({
    segmentsGroupLogs: [] as SegmentGroupLog[],
  }),

  actions: {
    setSegmentsGroupLogs(logs: SegmentGroupLog[]) {
      this.segmentsGroupLogs = logs
    },

    async loadSegmentsGroupLogs(id: number) {
      try {
        const { data, error } = await useFetch<SegmentGroupLog[]>(
          `/segments_groups/${id}/segments_group_logs.json`
        )
        if (error.value) throw error.value

        if (data.value) {
          this.setSegmentsGroupLogs(data.value)
        }
      } catch (err) {
        console.error('Failed to load segments group logs:', err)
      }
    },
  },
})
