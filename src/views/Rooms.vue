<template>
  <v-toolbar flat>
    <v-card-title>
      <v-icon
        icon="mdi-bed"
        start
      />
      Quartos
    </v-card-title>
    <v-spacer></v-spacer>
    <v-btn
      class="text-none"
      prepend-icon="mdi-sync"
      variant="outlined"
      @click="syncRooms(currentHotel.id)"
    >
      Sincronizar quartos
    </v-btn>
  </v-toolbar>
  <v-row>
    <v-col class="mx-5">
      <v-data-table
        :items="roomsByHotel[currentHotel?.id ?? '']?.rooms"
        :headers="tableHeaders"
        :loading="roomsByHotel[currentHotel?.id ?? '']?.loading"
      >
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { currentHotel } from '@/services/hotel';
import { roomsByHotel, fetchHotelRooms, syncRooms } from '@/services/room';
import { onMounted } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';

const tableHeaders = [
  { title: 'Nome', value: 'name' },
  { title: 'Ocupação máxima', value: 'capacity' },
  { title: 'ID Externo', value: 'externalId' },
  { title: 'Ações', key: 'actions', sortable: false },
];

onMounted(async () => {
  if (currentHotel.value === null) {
    return;
  }

  await fetchHotelRooms(currentHotel.value.id);
});

onBeforeRouteUpdate((to, from) => {
})
</script>
