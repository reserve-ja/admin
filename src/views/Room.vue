<template>
  <PageLoading v-if="isLoadingRooms || isLoadingRates" />
  <div v-else>
    <v-toolbar flat>
      <v-card-title>
        <v-btn to="/rooms" exact icon variant="text">
          <v-icon>
            mdi-arrow-left
          </v-icon>
        </v-btn>
        {{ room?.name }}
      </v-card-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <!-- <v-card>
      <v-card-text>
        <p>{{ room }}</p>
        <p>{{ rates }}</p>
      </v-card-text>
    </v-card> -->

    <v-row>
      <v-col class="mx-5">
        <v-data-table
          :items="rates"
          :headers="ratesHeaders"
          :loading="isLoadingRates"
          expand-on-click
        >
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
                      <td>{{ price.value }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import PageLoading from '@/components/PageLoading.vue';
import { useCurrentHotel } from '@/services/hotel';
import { useRooms, useRoomRates } from '@/services/room';
import { Room } from '@/services/room.types';
import { computed } from 'vue';

const props = defineProps<{ roomId: string }>();

const roomId = computed(() => props.roomId);
const { hotelId } = useCurrentHotel();

const { data: rooms, isPending: isLoadingRooms } = useRooms(hotelId);
const room = computed(() => rooms.value?.find((room: Room) => room.id === props.roomId));

const { data: rates, isPending: isLoadingRates } = useRoomRates(hotelId, roomId);

const ratesHeaders = [
  { title: 'Início', value: 'start' },
  { title: 'Fim', value: 'end' },
  { title: 'Preço padrão (R$)', value: 'defaultPrice' },
];
</script>
