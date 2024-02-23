<template>
  <v-app-bar color="#424242">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

    <v-app-bar-title>{{ title }}</v-app-bar-title>

    <v-spacer />

    <v-menu v-if="!props.loading">
      <template v-slot:activator="{ props }">
        <div v-bind="props" class="mr-5 account-menu">
          <v-avatar color="white" class="mr-2">
            {{ session?.user.email?.charAt(0).toUpperCase() }}
          </v-avatar>
          {{ session?.user.email?.split("@")[0] }}
        </div>
      </template>

      <v-list density="compact">
        <v-list-item class="text-caption">{{ session?.user.email }}</v-list-item>
        <v-list-item @click="logout">
          <template v-slot:prepend>
            <v-icon icon="mdi-logout" />
          </template>
          <v-list-item-title>Sair</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" >
    <div class="ma-3">
      <v-skeleton-loader
        v-if="props.loading"
        type="list-item"
      />
      <v-autocomplete
        v-else
        :model-value="currentHotel"
        @update:model-value="changeCurrentHotel"
        :items="hotels ?? []"
        density="comfortable"
        variant="outlined"
        hide-details
        prepend-inner-icon="mdi-office-building"
        item-title="name"
        item-value="id"
        return-object
      />
    </div>

    <v-divider />
    <v-skeleton-loader
      v-if="props.loading"
      v-for="i in 4"
      type="list-item"
    />
    <v-list v-else>
      <v-list-item exact to="/" prepend-icon="mdi-view-dashboard" title="Visão geral" />
      <v-list-item exact to="/rooms" prepend-icon="mdi-bed" title="Quartos" />
      <v-list-item exact to="/hotel" prepend-icon="mdi-cog" title="Configurações" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { session } from '@/store/auth'
import { logout } from '@/services/supabase'
import { Hotel, hotels, currentHotel } from '@/services/hotel';
import { computed } from 'vue';

interface Props {
  loading: boolean
}
const props = withDefaults(
  defineProps<Props>(),
  { loading: false }
);

const drawer = ref()

const title = computed(() => {
  if (currentHotel.value.name.length === 0) {
    return "M.B.E.";
  }

  return `M.B.E. — ${currentHotel.value.name}`
})

function changeCurrentHotel(hotel: Hotel) {
  currentHotel.value = hotel;
}

</script>

<style scoped>
.account-menu:hover {
  cursor: pointer;
}
</style>
