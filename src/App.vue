<template>
  <v-app class="h-screen">
    <div v-if="loadingAuth">
      <Loading />
    </div>
    <div v-else-if="session" class="h-100">
      <router-view/>
    </div>

    <Auth v-else />
    <ErrorSnackbar />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Auth from './views/Auth.vue'
import Loading from '@/layouts/Loading.vue'
import ErrorSnackbar from '@/components/ErrorSnackbar.vue'
import { useAuth } from './services/auth'

const { session, loadingAuth, initAuth } = useAuth();

onMounted(async () => {
  await initAuth();
})
</script>
