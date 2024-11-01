<template>
  <v-app-bar color="background" flat class="px-1" :class="{ 'px-4': smAndUp }">
    <v-app-bar-nav-icon v-show="mdAndDown" @click="drawer = !drawer" />

    <v-app-bar-title>
      <span v-if="smAndUp">🏨 </span>Reserve Já
    </v-app-bar-title>

    <v-menu v-if="!props.loading">
      <template v-slot:activator="{ props }">
        <div v-bind="props" class="account-menu">
          <span v-if="smAndUp" class="text-body-2">
            {{ session?.user.email?.split("@")[0] }}
          </span>
          <v-avatar color="primary" class="ml-2" size="small" :class="{ 'mr-1': !smAndUp }">
            {{ session?.user.email?.charAt(0).toUpperCase() }}
          </v-avatar>
        </div>
      </template>

      <v-list density="compact" rounded="lg">
        <v-list-item class="text-caption">{{ session?.user.email }}</v-list-item>
        <v-divider />
        <v-list-item @click="logout">
          <template v-slot:prepend>
            <v-icon icon="mdi-logout" />
          </template>
          <v-list-item-title>Sair</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    color="background"
    floating
    mobile-breakpoint="md"
    width="284"
    class="px-3 pt-6"
    :scrim="false"
  >
    <div class="mx-3 mb-3">
      <HotelSelect :loading="loading" />
    </div>

    <div v-if="props.loading">
      <v-skeleton-loader
        v-for="i in 4"
        :key="i"
        type="list-item"
      />
    </div>
    <v-list v-else density="comfortable">
      <v-list-item
        v-for="item in menuItems"
        :exact="item.exact"
        :to="item.to"
        rounded="xl"
        color="primary"
        class="pa-3 pl-7"
      >
        <v-icon>{{ item.icon }}</v-icon>
        <span class="text-subtitle-2 pl-3 ">{{ item.label }}</span>
      </v-list-item>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            rounded="xl"
            color="primary"
            class="pa-3 pl-7"
          >
            <v-icon>mdi-cog-outline</v-icon>
            <span class="text-subtitle-2 pl-3 ">Configurações</span>
          </v-list-item>
        </template>

        <v-list-item
          v-for="item in configItems"
          :to="item.to"
          rounded="xl"
          color="primary"
          class="pa-3"
        >
          <v-icon class="ml-7">{{ item.icon }}</v-icon>
          <span class="text-subtitle-2 pl-3">{{ item.label }}</span>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/services/auth'
import { useDisplay } from 'vuetify';
import HotelSelect from './HotelSelect.vue';

interface Props {
  loading: boolean
}
const props = withDefaults(
  defineProps<Props>(),
  { loading: false }
);

const drawer = ref<boolean>();

const { smAndUp, mdAndDown, name } = useDisplay();

const menuItems = [
  { label: "Visão geral", icon: "mdi-view-dashboard-outline",  to: "/" ,        exact: true  },
  { label: "Hotel",       icon: "mdi-office-building-outline", to: "/hotel",    exact: false },
  { label: "Quartos",     icon: "mdi-bed-outline",             to: "/rooms",    exact: false },
  { label: "Reservas",    icon: "mdi-calendar-check-outline",  to: "/bookings", exact: false },
];

const configItems = [
  // { label: "Integração PMS", icon: "mdi-cloud-sync-outline", to: "/config/pms" },
  // { label: "Pagamento",      icon: "mdi-cash",               to: "/config/payment" },
  { label: "Notificações",   icon: "mdi-email-outline",      to: "/config/notifications" },
]

const { session, logout } = useAuth();
</script>

<style scoped>
.account-menu:hover {
  cursor: pointer;
}
</style>
