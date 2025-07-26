<template>
  <app-bar :loading="false"/>
  <v-main class="h-100" :class="{ '': smAndUp }">
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import { useDisplay } from 'vuetify';

const { smAndUp } = useDisplay();
</script>
