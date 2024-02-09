<template>
  <v-app-bar color="#424242">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

    <v-app-bar-title>M.B.E.</v-app-bar-title>

    <v-spacer />

    {{ session?.user.email }}
    <v-btn @click="logout" icon="mdi-logout"></v-btn>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" >
    <div class="ma-3">
      <v-autocomplete
        v-model="hotels.current"
        :items="hotels.data"
        density="comfortable"
        hide-details
        prepend-inner-icon="mdi-office-building"
        variant="solo-filled"
        item-title="name"
        item-value="id"
        return-object
      />
    </div>


    <v-divider />
    <v-list>

    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { session } from '../store/auth'
import { logout } from '../services/supabase'
import { hotels } from '@/services/hotel';

const drawer = ref()
</script>
