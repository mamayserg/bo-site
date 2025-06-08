<template>
  <div>
    <h2 class="title pt-4 pb-4">Rules</h2>
    <draggable
      v-model="segments"
      @start="drag = true"
      @end="drag = false"
      @change="onDragUpdate"
      :options="draggableConfig"
    >
      <template
        v-if="segment.attributesValues && segment.attributesValues.length"
        v-for="(segment, index) in segments"
      >
        <v-layout
          :key="index"
          justify-space-around
          align-center
          fill-height
          row
          class="template"
        >
          <v-flex
            v-if="!attribute.templateTypeAttribute.common"
            v-for="attribute in orderBy(
              segment.attributesValues,
              'templateTypeAttribute.id'
            )"
            :key="`segment${index}_attribute-${attribute.templateTypeAttribute.id}`"
            class="attribute"
          >
            <v-layout
              align-center
              v-if="attribute.templateTypeAttribute.type === 'checkbox'"
            >
              <label class="v-label black--text pr-3 align-center">
                <v-tooltip
                  bottom
                  :disabled="
                    !Boolean(attribute.templateTypeAttribute.description)
                  "
                >
                  <span slot="activator">{{
                    attribute.templateTypeAttribute.label
                  }}</span>
                  <span>{{ attribute.templateTypeAttribute.description }}</span>
                </v-tooltip>
              </label>
              <v-flex
                v-for="(gender, position) of genders"
                :key="genders[position].label"
              >
                <v-checkbox
                  class="pr-3"
                  :input-value="attribute.value.split(',')"
                  :value="gender.value"
                  :label="gender.label"
                  :multiple="true"
                  @change="updateAttributeValue(attribute, gender.value)"
                />
              </v-flex>
            </v-layout>

            <v-tooltip
              v-else
              bottom
              :disabled="!Boolean(attribute.templateTypeAttribute.description)"
            >
              <v-text-field
                slot="activator"
                v-model="attribute.value"
                :type="attribute.templateTypeAttribute.type"
                v-validate="{
                  required: attribute.templateTypeAttribute.required,
                }"
                :error-messages="
                  errors.collect(
                    `segment${index}_attribute-${attribute.templateTypeAttribute.code}`
                  )
                "
                :data-vv-name="`segment${index}_attribute-${attribute.templateTypeAttribute.code}`"
                :data-vv-as="
                  attribute.templateTypeAttribute.label.toLowerCase()
                "
                :name="`segment${index}_attribute-${attribute.templateTypeAttribute.code}`"
                :label="attribute.templateTypeAttribute.label"
              />
              <span>{{ attribute.templateTypeAttribute.description }}</span>
            </v-tooltip>
          </v-flex>

          <div :key="index">
            <v-tooltip left>
              <v-btn
                dark
                small
                fab
                slot="activator"
                color="red"
                @click.native="removeSegment(index)"
              >
                <v-icon>delete</v-icon>
              </v-btn>
              <span>Delete</span>
            </v-tooltip>

            <v-tooltip left v-if="!Boolean(sortableConfig.disabled)">
              <v-btn dark small fab slot="activator" color="primary">
                <v-icon>reorder</v-icon>
              </v-btn>
              <span>Move</span>
            </v-tooltip>
          </div>
        </v-layout>
      </template>
    </draggable>
  </div>
</template>

<script>
import CustomSelect from "../../commons/CustomSelect.vue";
import Draggable from "vuedraggable";

export default {
  name: "Template",
  components: {
    CustomSelect,
    Draggable,
  },
  inject: {
    $validator: "$validator",
  },
  props: {
    segments: {
      type: Array,
      default: () => [],
    },
    attributes: {
      type: Array,
      default: () => [],
    },
    sortableConfig: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      genders: [
        { label: "Male", value: "m" },
        { label: "Female", value: "f" },
        { label: "Undefined", value: "u" },
      ],
      drag: false,
    };
  },
  computed: {
    draggableConfig() {
      // shallow clone sortableConfig (no lodash)
      return Object.assign({ draggable: ".template" }, this.sortableConfig);
    },
  },
  methods: {
    orderBy(collection = [], key) {
      // Simple sort by key string path like 'templateTypeAttribute.id'
      // Support only one-level nested keys for simplicity
      const keys = key.split(".");
      return collection.slice().sort((a, b) => {
        const aVal = keys.reduce((obj, k) => (obj ? obj[k] : undefined), a);
        const bVal = keys.reduce((obj, k) => (obj ? obj[k] : undefined), b);
        if (aVal === undefined) return 1;
        if (bVal === undefined) return -1;
        if (aVal > bVal) return 1;
        if (aVal < bVal) return -1;
        return 0;
      });
    },
    removeSegment(index) {
      if (this.segments.length === 1) {
        return this.$store.dispatch(
          "notification/error",
          "At least one segment must be provided !"
        );
      }
      this.segments.splice(index, 1);
      this.updateIndex(this.segments);
    },
    updateIndex(segmentsOrder) {
      if (segmentsOrder.length > 0) {
        segmentsOrder.forEach((value, index) => {
          // Vue.set equivalent:
          this.$set(value, "sortIndex", index);
        });
      }
      this.$emit("update:order", segmentsOrder);
    },
    onDragUpdate() {
      // shallow clone array (no lodash)
      const segmentsOrder = this.segments.slice();
      this.updateIndex(segmentsOrder);
    },
    updateAttributeValue(attribute, gender) {
      // Parse attribute.value string into array, filter empty strings
      let localGender = attribute.value
        .split(",")
        .filter((attr) => attr !== "");

      // Use Set to toggle gender
      const set = new Set(localGender);

      if (set.has(gender)) {
        set.delete(gender);
      } else {
        set.add(gender);
      }

      attribute.value = Array.from(set).join(",");
    },
  },
};
</script>
