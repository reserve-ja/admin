<template>
  <v-app id="inspire">
    <div v-if="loading">
      <h1>Loading...</h1>
    </div>
    <div v-else-if="session && !loading">
      <v-main>
        <AppBar />
        <Account/>
      </v-main>
    </div>

    <Auth v-else />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Account from './components/Account.vue'
import AppBar from './components/AppBar.vue'
import Auth from './components/Auth.vue'
import { supabase } from './services/supabase'
import { loading, session } from './store/auth'
import { loadHotels } from './services/hotel'

onMounted(() => {
  loading.value = true;
  supabase.auth.getSession();

  supabase.auth.onAuthStateChange(async (_, _session) => {
    if (_session != null && _session.user.id != session.value?.user.id) {
      session.value = _session
      await loadHotels();
    }
    loading.value = false;
  })
})
</script>
