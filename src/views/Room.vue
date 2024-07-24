<template>
  <PageLoading v-if="isLoadingRooms || isLoadingRates" />
  <Page :title="room?.name ?? ''" previous-route="/rooms" v-else>
    <template #actions>
      <v-btn
        variant="outlined"
        text="Editar"
        class="mx-1"
        @click="editDetailsDialog = true"
      />
      <v-btn
        text="Adicionar tarifa"
        class="mx-1"
        @click="addRateDialog = true"
      />
    </template>
    <template #default>
      <v-row>
        <v-col cols="12" md="6">
          <p class="text-h6 font-weight-regular pt-3">Detalhes</p>
          <DetailsTable :items="details" />
        </v-col>
      </v-row>

      <p class="text-h6 font-weight-regular pt-3">Tarifas</p>
      <v-data-table
        :items="rates"
        :headers="ratesHeaders"
        :loading="isLoadingRates || isLoadingRatePlans"
      >
        <template v-slot:[`item.ratePlanId`]="{ item }">
          {{ ratePlanName(item.ratePlanId) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            icon="mdi-trash-can-outline"
            variant="text"
            @click="deleteRate(item)"
          />
        </template>
      </v-data-table>
    </template>
  </Page>

  <RoomDetailsEditDialog v-model="editDetailsDialog" :room-id="roomId" />
  <AddRateDialog v-model="addRateDialog" :room-id="roomId" />
  <RemoveRateDialog
    v-model="deleteRateDialog"
    :hotel-id="deleteRateHotelId"
    :room-id="deleteRateRoomId"
    :rate-id="deleteRateRateId" />
</template>

<script setup lang="ts">
import Page from '@/components/Page.vue';
import PageLoading from '@/components/PageLoading.vue';
import DetailsTable from '@/components/DetailsTable.vue';
import RoomDetailsEditDialog from '@/components/RoomDetailsEditDialog.vue';
import AddRateDialog from '@/components/AddRateDialog.vue';
import RemoveRateDialog from '@/components/RemoveRateDialog.vue';
import { useCurrentHotel } from '@/services/hotel';
import { useRooms, useRoomRates } from '@/services/room';
import { Room, Rate } from '@/services/room.types';
import { ref } from 'vue';
import { computed } from 'vue';
import { useRatePlans } from '@/services/rate-plan';

const props = defineProps<{ roomId: string }>();

const addRateDialog = ref<boolean>(false);
const editDetailsDialog = ref<boolean>(false);

const roomId = computed(() => props.roomId);
const { hotelId } = useCurrentHotel();

const { rooms, isLoadingRooms } = useRooms(hotelId);
const room = computed(() => rooms.value?.find((room: Room) => room.id === props.roomId));

const details = computed(() => [
  { title: 'Descrição', icon: 'mdi-card-text-outline', value: room.value?.description ?? '' },
  { title: 'ID PMS', icon: 'mdi-pound-box-outline', value: room.value?.externalId ?? '' },
  { title: 'Capacidade', icon: 'mdi-account-multiple-outline', value: room.value?.capacity.toString() ?? '' },
]);

const { rates, isLoadingRates } = useRoomRates(hotelId, roomId);
const { ratePlans, isLoadingRatePlans } = useRatePlans(hotelId);

const ratesHeaders = [
  { title: 'Data', key: 'date', },
  { title: 'Tarifa', key: 'ratePlanId' },
  { title: 'Hóspedes', key: 'guests' },
  { title: 'Preço (R$)', key: 'price' },
  { title: 'Ações', key: 'actions', sortable: false },
];

function ratePlanName(ratePlanId: string): string {
  return ratePlans.value?.find(rp => rp.id === ratePlanId)?.name ?? '';
}

const deleteRateDialog = ref<boolean>(false);
const deleteRateHotelId = ref<string>('');
const deleteRateRoomId = ref<string>('');
const deleteRateRateId = ref<string>('');
function deleteRate(item: Rate) {
  deleteRateHotelId.value = hotelId.value;
  deleteRateRoomId.value = roomId.value;
  deleteRateRateId.value = item.id;
  deleteRateDialog.value = true;
}
</script>
