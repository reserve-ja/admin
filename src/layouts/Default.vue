<template>
  <v-app>
    <app-bar :loading="false"/>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
</script>
