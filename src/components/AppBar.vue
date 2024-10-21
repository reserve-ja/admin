<template>
  <v-app-bar color="background" flat>
    <v-app-bar-nav-icon v-show="mdAndDown" @click="drawer = !drawer" />

    <v-app-bar-title>
      <span v-if="smAndUp">🏨</span>Reserve Já
    </v-app-bar-title>

    <v-menu v-if="!props.loading">
      <template v-slot:activator="{ props }">
        <div v-bind="props" class="mr-5 account-menu">
          <span v-if="smAndUp">
            {{ session?.user.email?.split("@")[0] }}
          </span>
          <v-avatar color="primary" class="ml-2">
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
    class="px-3"
    :scrim="false"
  >
    <div class="mx-3">
      <v-skeleton-loader
        v-if="props.loading"
        type="list-item"
      />
      <v-autocomplete
        v-else-if="showHotelSelect"
        :model-value="currentHotel"
        @update:model-value="changeHotel"
        :items="hotels"
        hide-details
        item-title="name"
        item-value="id"
        return-object
      />
    </div>

    <div v-if="props.loading">
      <v-skeleton-loader
        v-for="i in 4"
        :key="i"
        type="list-item"
      />
    </div>
    <v-list v-else density="comfortable">
      <v-list-item exact to="/" rounded="xl" class="pa-3 pl-7">
        <v-icon>mdi-view-dashboard-outline</v-icon>
        <span class="pl-3">Visão geral</span>
      </v-list-item>
      <v-list-item to="/hotel" rounded="xl" class="pa-3 pl-7">
        <v-icon>mdi-office-building-outline</v-icon>
        <span class="pl-3">Hotel</span>
      </v-list-item>
      <v-list-item to="/rooms" rounded="xl" class="pa-3 pl-7">
        <v-icon>mdi-bed-outline</v-icon>
        <span class="pl-3">Quartos</span>
      </v-list-item>
      <v-list-item to="/bookings" rounded="xl" class="pa-3 pl-7">
        <v-icon>mdi-calendar-check-outline</v-icon>
        <span class="pl-3">Reservas</span>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useAuth } from '@/services/auth'
import { computed } from 'vue';
import { useListHotels, useCurrentHotel } from '@/services/hotel';
import { Hotel } from '@/services/hotel.types';
import { useDisplay } from 'vuetify';

interface Props {
  loading: boolean
}
const props = withDefaults(
  defineProps<Props>(),
  { loading: false }
);

const drawer = ref<boolean>();

const { smAndUp, mdAndDown } = useDisplay();

// const title = computed(() => {
//   if (!currentHotel.value?.name) {
//     return "Reserve Já";
//   }

//   return currentHotel.value?.name;
// });

const { hotels } = useListHotels();
const { hotelId, changeCurrentHotel } = useCurrentHotel();

const showHotelSelect = computed(() => {
  return (hotels.value?.length ?? 0) > 1;
});

const currentHotel = computed(() => {
  return hotels.value?.find(hotel => hotel.id === hotelId.value);
})

// const router = useRouter();
function changeHotel(hotel: Hotel) {
  changeCurrentHotel(hotel.id);
  // router.push({ name: 'Hotel' });
}

const { session, logout } = useAuth();
</script>

<style scoped>
.account-menu:hover {
  cursor: pointer;
}
</style>
