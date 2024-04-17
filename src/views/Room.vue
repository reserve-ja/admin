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
      <p class="text-h6 font-weight-regular pt-3">Detalhes</p>
      <DetailsTable :items="details" />

      <p class="text-h6 font-weight-regular pt-3">Tarifas</p>
      <v-data-table
        :items="rates"
        :headers="ratesHeaders"
        :loading="isLoadingRates"
        show-expand
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            icon="mdi-trash-can-outline"
            variant="text"
            @click="deleteRate(item)"
          />
        </template>
        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <v-table theme="dark" density="compact">
                <thead>
                  <tr>
                    <th class="text-left">
                      <v-icon size="small">mdi-cash</v-icon>
                      Método de pagamento
                    </th>
                    <th class="text-left">
                      <v-icon size="small">mdi-account-multiple</v-icon>
                      Hóspedes
                    </th>
                    <th class="text-left">
                      <v-icon size="small">mdi-currency-usd</v-icon>
                      Valor (R$)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(price, i) in item.prices.sort((a, b) =>
                      a.paymentMethod.localeCompare(b.paymentMethod) || a.guests + b.guests)"
                    :key="`price-${i}`"
                  >
                    <td>{{ price.paymentMethod }}</td>
                    <td>{{ price.guests }}</td>
                    <td>{{ price.amount }}</td>
                  </tr>
                </tbody>
              </v-table>
            </td>
          </tr>
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

const ratesHeaders = [
  { title: 'Início', value: 'start' },
  { title: 'Fim', value: 'end' },
  { title: 'Preço padrão (R$)', value: 'defaultPrice' },
  { title: 'Ações', value: 'actions', sortable: false },
];

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
