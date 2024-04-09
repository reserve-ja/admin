<template>
  <v-app>
    <app-bar loading />
    <v-main class="ma-4">
      <PageLoading />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import PageLoading from '@/components/PageLoading.vue';
</script>
