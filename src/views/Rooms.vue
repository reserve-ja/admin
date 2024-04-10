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
      :loading="isSyncing"
      :disabled="isSyncing"
      @click="syncRooms"
    >
      Sincronizar quartos
    </v-btn>
  </v-toolbar>
  <v-row>
    <v-col class="mx-5">
      <v-data-table
        :items="rooms"
        :headers="tableHeaders"
        :loading="isLoadingRooms"
      >
        <template v-slot:[`item.name`]="{ item }">
          <router-link :to="`/rooms/${item.id}`">
            {{ item.name }}
          </router-link>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
  <pre>
    {{ isLoadingRooms }}
  </pre>
  {{ rooms }}
</template>

<script setup lang="ts">
import { useCurrentHotel } from '@/services/hotel';
import { useRooms, useSyncRooms } from '@/services/room';

const { hotelId } = useCurrentHotel();

const { rooms, isLoadingRooms } = useRooms(hotelId);
const { syncRooms, isSyncing } = useSyncRooms(hotelId);

const tableHeaders = [
  { title: 'Nome', value: 'name' },
  { title: 'Ocupação máxima', value: 'capacity' },
  { title: 'ID Externo', value: 'externalId' },
  { title: 'Ações', key: 'actions', sortable: false },
];
</script>
