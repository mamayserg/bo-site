<template>
  <div class="space-y-4">
    <div
      v-for="(segment, index) in segments"
      :key="index"
      class="flex flex-wrap gap-4 items-center"
    >
      <div class="w-full md:w-5/12">
        <label class="block mb-1 font-medium" :for="`segment-name-${index}`">
          Segment name
        </label>
        <input
          v-model="segment.name"
          :id="`segment-name-${index}`"
          type="text"
          class="input input-bordered w-full"
          :class="{ 'border-red-500': errors[`segmentName${index}`] }"
          @input="validateSegmentName(index)"
          placeholder="Segment name"
        />
        <p
          v-if="errors[`segmentName${index}`]"
          class="text-red-600 text-sm mt-1"
        >
          {{ errors[`segmentName${index}`] }}
        </p>
      </div>

      <div class="w-full md:w-5/12">
        <label class="block mb-1 font-medium" :for="`segment-value-${index}`">
          Segment value
        </label>
        <input
          v-model="segment.value"
          :id="`segment-value-${index}`"
          type="text"
          class="input input-bordered w-full"
          placeholder="Segment value"
        />
      </div>

      <div class="w-full md:w-5/12">
        <label
          class="block mb-1 font-medium"
          :for="`segment-description-${index}`"
        >
          Segment description
        </label>
        <input
          v-model="segment.description"
          :id="`segment-description-${index}`"
          type="text"
          class="input input-bordered w-full"
          placeholder="Segment description"
        />
        <p
          v-if="errors[`segmentDescription${index}`]"
          class="text-red-600 text-sm mt-1"
        >
          {{ errors[`segmentDescription${index}`] }}
        </p>
      </div>

      <div class="w-12 flex justify-center items-center mt-6 md:mt-0">
        <button
          @click="removeSegment(index)"
          type="button"
          class="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow"
          title="Delete"
          aria-label="Delete segment"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        @click.prevent="addSegment"
        type="button"
        class="bg-primary hover:bg-primary-dark text-white rounded-full p-3 shadow"
        title="Add a segment"
        aria-label="Add a segment"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs } from "vue";
import { useNotificationStore } from "~/stores/notification";

const props = defineProps({
  segments: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:segments"]);

const notificationStore = useNotificationStore();

// Simple reactive errors object to hold validation errors
const errors = reactive({});

function validateSegmentName(index) {
  const name = props.segments[index].name;
  if (!name) {
    errors[`segmentName${index}`] = "Segment name is required";
  } else if (!/^[a-z0-9\/\-\_ ]+$/i.test(name)) {
    errors[`segmentName${index}`] = "Invalid characters in segment name";
  } else {
    delete errors[`segmentName${index}`];
  }
}

function addSegment() {
  props.segments.push({
    name: "",
    value: "",
    description: "",
  });
  emit("update:segments", props.segments);
}

function removeSegment(index) {
  if (props.segments.length === 1) {
    notificationStore.error("At least one segment must be provided!");
    return;
  }
  props.segments.splice(index, 1);
  emit("update:segments", props.segments);
}
</script>

<!-- <style scoped>
.input {
  @apply border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
}

.bg-primary {
  @apply bg-blue-600;
}

.bg-primary-dark {
  @apply bg-blue-700;
}
</style> -->
