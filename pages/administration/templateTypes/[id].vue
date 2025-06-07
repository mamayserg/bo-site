<template>
  <AdminTemplateTypesForm
    ref="form"
    :title="'Update template type'"
    :template-type="templateType"
    @submit="updateTemplateType"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminTemplateTypesForm from '~/components/administration/templateTypes/AdminTemplateTypesForm.vue'
import { useTemplateTypesStore } from '@/stores/templateTypes'
import { useNotificationStore } from '@/stores/notification'

const route = useRoute()
const router = useRouter()
const form = ref()

const templateTypesStore = useTemplateTypesStore()
const notificationStore = useNotificationStore()

const templateType = computed(() => templateTypesStore.currentTemplateType)

onMounted(async () => {
  const id = route.params.id
  await templateTypesStore.loadTemplateType(id)
  await templateTypesStore.loadTemplateTypes()
  await templateTypesStore.loadAttributes()
})

const updateTemplateType = async (updatedTemplateType: any, attributesToUpdate: any[]) => {
  try {
    for (const attribute of attributesToUpdate) {
      await templateTypesStore.updateAttribute(attribute)
    }

    await templateTypesStore.updateTemplateType(updatedTemplateType)

    notificationStore.success(`Template type "${templateType.value.name}" updated`)
    router.push('/administration/templateTypes')
  } catch (error: any) {
    notificationStore.error('Failed to update template type.')

    if (error.response?.data?.violations && form.value?.addError) {
      error.response.data.violations.forEach((violation: any) => {
        form.value.addError(violation.propertyPath, violation.message)
      })
    }
  }
}
</script>
