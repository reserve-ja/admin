<template>
  <v-card scrollable class="rounded-0 h-100" variant="flat" :class="{ 'mx-5': smAndUp, 'rounded-xl': smAndUp }">
    <v-card-item class="page-top-bar py-3 px-4 border-b-thin" :class="{ 'pl-2': previousRoute, 'mt-3': smAndUp }">
      <v-card-title class="d-flex align-center">
        <v-btn v-if="previousRoute" :to="previousRoute" exact icon="mdi-arrow-left" variant="text" />
        <!-- <v-icon v-if="icon" :icon="icon" start size="large" /> -->
        <span class="font-weight-regular">{{ title }}</span>
      </v-card-title>

      <template v-slot:append>
        <slot name="actions"></slot>
      </template>
    </v-card-item>
    <!-- <v-toolbar color="red" style="">
      <v-card-title>
        <v-icon
          :icon="icon"
          start
        />
        {{ title }}
      </v-card-title>
      <v-spacer></v-spacer>
      <slot name="actions"></slot>
    </v-toolbar> -->

    <div class="overflow-y-auto h-100 px-4 pb-10">
      <div class="mb-10">
        <slot></slot>
      </div>
    </div>
    <!-- <v-virtual-scroll :items="[1]" class="h-100">
      <div class="pa-5">
        <slot></slot>

      </div>
    </v-virtual-scroll> -->
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';

defineProps<{
  title: string,
  icon?: string,
  previousRoute?: string,
}>();

const { smAndUp } = useDisplay();
</script>
