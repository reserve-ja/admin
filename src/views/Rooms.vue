<template>
  <Page title="Quartos" icon="mdi-bed">
    <template #actions>
      <v-btn variant="outlined" @click="syncRooms" :loading="isSyncing">Sincronizar com PMS</v-btn>
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
  { title: 'Nome', value: 'name' },
  { title: 'Ocupação máxima', value: 'capacity' },
  { title: 'ID Externo', value: 'externalId' },
  { title: 'Ações', key: 'actions', sortable: false },
];
</script>
