<template>
  <Page title="Quartos" icon="mdi-bed">
    <template #actions>
      <v-btn
        variant="text"
        @click="syncRooms"
        :loading="isSyncing"
        prepend-icon="mdi-sync"
        text="Sincronizar"
      />
    </template>
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
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/Page.vue'
import { useCurrentHotel } from '@/services/hotel';
import { useRooms, useSyncRooms } from '@/services/room';

const { hotelId } = useCurrentHotel();

const { rooms, isLoadingRooms } = useRooms(hotelId);
const { syncRooms, isSyncing } = useSyncRooms(hotelId);

const tableHeaders = [
  { title: 'Nome', key: 'name' },
  { title: 'Ocupação máxima', key: 'capacity' },
  { title: 'ID Externo', key: 'externalId' },
  { title: 'Ações', key: 'actions', sortable: false },
];
</script>
