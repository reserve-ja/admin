<template>
  <app-bar :loading="false"/>
  <v-main class="h-100" :class="{ 'pb-5': smAndUp }">
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs';

const { smAndUp } = useDisplay();
</script>
