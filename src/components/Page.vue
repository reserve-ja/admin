<template>
  <v-toolbar flat>
    <v-card-title>
      <v-icon
        :icon="icon"
        start
      />
      {{ title }}
    </v-card-title>
    <v-spacer></v-spacer>
    <slot name="actions"></slot>
  </v-toolbar>
  <v-row>
    <v-col class="ma-5">
      <slot></slot>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  icon: string;
}>();
</script>
