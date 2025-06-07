<template>
  <div>
    <Button
      icon="pi pi-trash"
      severity="danger"
      @click="dialogVisible = true"
      :disabled="disabled"
      class="delete-btn p-2"
      v-tooltip.top="disabled ? disabledDescription : 'Delete'"
    />

    <Dialog
      v-model:visible="dialogVisible"
      modal
      :closable="false"
      :style="{ width: '24rem' }"
    >
      <template #header>
        <span class="text-lg font-semibold">Confirm delete?</span>
      </template>

      <p>This action cannot be undone.</p>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="No" severity="danger" @click="dialogVisible = false" />
          <Button label="Yes" severity="success" @click="confirmDelete" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue';
// import { Button } from 'primevue/button';
// import { Dialog } from 'primevue/dialog';
// import { Tooltip } from 'primevue/tooltip';

defineProps<{
  disabled?: boolean;
  disabledDescription?: string;
}>();

const emit = defineEmits(['deleteAction']);
const dialogVisible = ref(false);

function confirmDelete() {
  dialogVisible.value = false;
  emit('deleteAction');
}
</script>
