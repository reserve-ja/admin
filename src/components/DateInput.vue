<template>
  <v-text-field
    v-if="xs"
    v-bind="props"
    :model-value="readableDate"
    :variant="variant"
    :label="label"
    :prepend-icon="prependIcon"
    :density="density"
    readonly
  >
    <v-dialog
      activator="parent"
      fullscreen
    >
      <template v-slot:default="{ isActive }">
        <v-date-picker
          :model-value="model"
          @update:model-value="selectDate($event, isActive)"
          color="primary"
          :show-adjacent-months="showAdjacentMonths"
        />
      </template>
    </v-dialog>
  </v-text-field>

  <v-text-field
    v-else
    v-bind="props"
    :model-value="readableDate"
    :variant="variant"
    :label="label"
    :prepend-icon="prependIcon"
    :density="density"
    readonly
    :hide-details="hideDetails"
  >
    <v-menu
      activator="parent"
      :close-on-content-click="false"
      transition="scale-transition"
      location="bottom"
    >
      <template v-slot:default="{ isActive }">
        <v-date-picker
          :model-value="model"
          @update:model-value="selectDate($event, isActive)"
          color="primary"
          :show-adjacent-months="showAdjacentMonths"
          hide-header
        />
      </template>
    </v-menu>
  </v-text-field>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { Ref } from 'vue';

const props = defineProps<{
  variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled',
  density?: 'default' | 'comfortable' | 'compact',
  label: string | undefined,
  prependIcon?: string | undefined,
  showAdjacentMonths?: boolean | undefined,
  hideDetails?: boolean,
}>();
const model = defineModel<Date>({ required: true });

const { xs } = useDisplay();
const readableDate = computed(() =>  model.value.toLocaleDateString('pt-BR'));

function selectDate(event: Date, isActive: Ref<boolean>): void {
  model.value = event;
  isActive.value = false;
}
</script>
