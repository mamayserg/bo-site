<template>
  <div>
    <Dropdown
      :options="items"
      :model-value="value"
      @update:model-value="updateValue"
      option-label="name"
      option-value="id"
      :multiple="multiple"
      :disabled="readOnly"
      :filter="true"
      :show-clear="true"
      :placeholder="label"
      class="w-full"
    />
    <p v-if="errorsHandler && errorsHandler.collect(name).length" class="text-red-600 text-sm mt-1">
      {{ errorsHandler.collect(name).join(', ') }}
    </p>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useSegmentsGroupStore } from '@/stores/segmentsGroups'; // adjust path
import Dropdown from 'primevue/dropdown';

const props = defineProps({
  name: {
    type: String,
    default: 'Default label',
  },
  value: {
    type: [Array, Number, Object, String],
    default: () => [],
  },
  label: {
    type: String,
    default: 'Default label',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  errorsHandler: {
    type: Object,
    default: () => ({ collect: () => [] }),
  },
});

const emit = defineEmits(['update:value']);

const segmentsGroupsStore = useSegmentsGroupStore();

const items = computed(() => segmentsGroupsStore[props.name] || []);

const updateValue = (val) => {
  emit('update:value', val);
};

onMounted(async () => {
  await segmentsGroupsStore.loadSegmentsGroup(props.name);
});
</script>
