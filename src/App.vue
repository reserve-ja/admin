<template>
  <v-app id="inspire">
    <div v-if="loadingAuth">
      <Loading />
    </div>
    <div v-else-if="session">
      <router-view/>
    </div>

    <Auth v-else />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Auth from './views/Auth.vue'
import Loading from '@/layouts/Loading.vue'
import { useAuth } from './services/auth'

const { session, loadingAuth, initAuth } = useAuth();

onMounted(async () => {
  await initAuth();
})
</script>
