<template>
  <v-navigation-drawer v-model="drawer">
    <!--  -->
  </v-navigation-drawer>

  <v-app-bar>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

    <v-app-bar-title>M.B.E.</v-app-bar-title>

    <v-spacer />

    {{ session?.user.email }}
    <v-btn @click="logout" icon="mdi-logout"></v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { session } from '../store/auth'
import { logout } from '../services/supabase'

const drawer = ref(false)
</script>
