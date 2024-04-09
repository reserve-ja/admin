<template>
  <v-app id="inspire">
    <div v-if="loading">
      <Loading />
    </div>
    <div v-else-if="session && !loading">
      <router-view/>
    </div>

    <Auth v-else />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Auth from './components/Auth.vue'
import Loading from '@/layouts/Loading.vue'
import { supabase } from './services/supabase'
import { loading, session } from './store/auth'
import { useQueryClient } from '@tanstack/vue-query'
import { useListHotels } from './services/hotel'

onMounted(() => {
  loading.value = true;
  supabase.auth.getSession();
  supabase.auth.onAuthStateChange(async (_, _session) => {
    if (_session != null && _session.user.id != session.value?.user.id) {
      session.value = _session;

      console.log('on auth change');
      // useHotels().refetch();
      // useQueryClient().invalidateQueries({ queryKey: ['hotels'], exact: true });
      // await fetchHotels();
    }
    loading.value = false;
  });

  const { hotels } = useListHotels();

})
</script>
