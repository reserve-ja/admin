<template>
  <v-app id="inspire">
    <div v-if="session">
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
import { session } from './store/auth'

onMounted(() => {
  supabase.auth.getSession().then(({ data  }) => {
    session.value = data.session;
    console.log('get session: ')
    console.log(data.session)
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
    console.log('on change: ');
    console.log(_session)
  })
})
</script>
