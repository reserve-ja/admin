<template>
  <v-dialog v-model="model" :fullscreen="smAndDown" :max-width="smAndDown ? undefined : maxWidth">
    <v-card class="h-100" :rounded="!smAndDown">
      <v-card-item class="pa-2" :class="{ 'pt-3': !smAndDown }">
        <v-card-title class="d-flex align-center">
          <v-btn v-if="smAndDown" icon="mdi-arrow-left" variant="text" @click="model = false" />
          <!-- <v-icon v-if="icon" :icon="icon" start size="large" /> -->
          <span class="text-h5 pl-3" :class="{ 'pl-4': !smAndDown }">{{ title }}</span>
        </v-card-title>

        <template v-slot:append v-if="!smAndDown">
          <v-btn icon="mdi-close" variant="text" @click="model = false" />
        </template>
      </v-card-item>
      <div class="overflow-y-auto h-100 pa-5">
        <slot></slot>
      </div>

      <v-divider />
      <v-card-actions class="py-3">
        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';

defineProps<{
  title: string,
  icon?: string,
  maxWidth?: string,
}>();

const model = defineModel<boolean>({ required: true });

const { smAndDown } = useDisplay();
</script>
