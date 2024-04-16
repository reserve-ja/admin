<template>
  <Page title="Hotel">
    <template #actions>
      <v-btn variant="flat" color="primary" class="text-none mx-1" :to="{ name: 'HotelEdit' }">Editar</v-btn>
      <v-btn variant="outlined" class="text-none mx-1" :to="{ name: 'HotelEditPmsConfig' }">
        Configurar PMS
      </v-btn>
    </template>
    <template #default>
      <v-row>
        <v-col cols="12" md="6" lg="4">
          <p class="text-h6 font-weight-regular">Detalhes</p>
          <v-table>
            <tbody>
              <tr>
                <td class="text-medium-emphasis">
                  <v-icon start>mdi-card-text-outline</v-icon>
                  Nome
                </td>
                <td>{{ currentHotel?.name }}</td>
              </tr>
              <tr>
                <td class="text-medium-emphasis">
                  <v-icon start>mdi-database-outline</v-icon>
                  PMS
                </td>
                <td>{{ currentHotel?.pms }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </template>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/Page.vue';
import { useCurrentHotel, useListHotels } from '@/services/hotel';
import { computed } from 'vue';

const { hotels } = useListHotels();
const { hotelId } = useCurrentHotel();

const currentHotel = computed(() => hotels.value?.find(hotel => hotel.id === hotelId.value));
</script>
