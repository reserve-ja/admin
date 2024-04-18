<template>
  <Page title="Hotel">
    <template #actions>
      <v-btn
        v-if="hasPermission(currentHotel?.id, 'hotel.write')"
        variant="flat"
        color="primary"
        class="mx-1"
        :to="{ name: 'HotelEdit' }"
        text="Editar"
      />
      <v-btn
        v-if="hasPermission(currentHotel?.id, 'hotel.write')"
        variant="outlined"
        class="mx-1"
        :to="{ name: 'HotelEditPmsConfig' }"
        text="Configurar PMS"
      />
    </template>
    <template #default>
      <v-row>
        <v-col cols="12" md="6">
          <p class="text-h6 font-weight-regular pt-3">Detalhes</p>
          <DetailsTable :items="details" />
        </v-col>
      </v-row>
    </template>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/Page.vue';
import DetailsTable from '@/components/DetailsTable.vue';
import { useCurrentHotel, useListHotels } from '@/services/hotel';
import { useUser } from '@/services/user';
import { computed } from 'vue';

const { hotels } = useListHotels();
const { hotelId } = useCurrentHotel();

const currentHotel = computed(() => hotels.value?.find(hotel => hotel.id === hotelId.value));

const details = computed(() => [
  { title: 'Nome', icon: 'mdi-card-text-outline', value: currentHotel.value?.name ?? '' },
  { title: 'PMS', icon: 'mdi-database-outline', value: currentHotel.value?.pms ?? '' },
]);

const { hasPermission } = useUser();
</script>
