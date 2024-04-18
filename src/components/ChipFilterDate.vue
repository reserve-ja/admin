<template>
  <v-chip
    :variant="model ? 'tonal' : 'outlined'"
    :prepend-icon="icon"
    rounded
    class="mx-1"
    @click="clickChip"
  >
    <span ref="chip" class="">
      {{ label + (model ? ': '  : '') }}
      <span class="font-weight-medium">{{ model?.toISOString().substring(0, 10) }}</span>
    </span>
    <v-icon v-if="model" end @click="clear">mdi-close</v-icon>
  </v-chip>

  <v-dialog
    v-if="xs"
    :activator="chip"
    fullscreen
  >
    <template v-slot:default="{ isActive }">
      <v-date-picker
        :model-value="model"
        @update:model-value="selectDate($event, isActive)"
        color="primary"
      />
    </template>
  </v-dialog>

  <v-menu
    v-else
    :activator="chip"
    :close-on-content-click="false"
    transition="scale-transition"
    location="bottom"
    offset="10, 30"
  >
    <template v-slot:default="{ isActive }">
      <v-date-picker
        :model-value="model"
        @update:model-value="selectDate($event, isActive)"
        color="primary"
        hide-header
      />
    </template>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useDisplay } from 'vuetify';

const model = defineModel<Date>();

const chip = ref();
const isPickerOpen = ref<boolean>(false);

defineProps<{
  icon: string;
  label: string;
}>();

const { xs } = useDisplay();
// const readableDate = computed(() =>  model.value.toLocaleDateString());

function selectDate(event: Date, isActive?: Ref<boolean>): void {
  isPickerOpen.value = false;
  model.value = event;
  if (isActive) {
    isActive.value = false;
  }
}

function clear() {
  model.value = undefined;
}

function clickChip() {
  // does nothing, but makes the chip clickable
}
</script>
