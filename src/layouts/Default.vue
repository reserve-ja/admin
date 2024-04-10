<template>
  <app-bar :loading="false"/>
  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
</script>
