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
        text="Configurar PMS"
        variant="outlined"
        class="mx-1"
        :to="{ name: 'HotelEditPmsConfig' }"
      />
      <v-btn
        v-if="hasPermission(currentHotel?.id, 'hotel.write')"
        variant="outlined"
        class="mx-1"
        text="Adicionar Gateway"
        @click="addGatewayDialog = true"
      />
    </template>
    <template #default>
      <v-row>
        <v-col cols="12" md="6">
          <p class="text-h6 font-weight-regular pt-3">Detalhes</p>
          <DetailsTable :items="details" />
        </v-col>
        <v-col cols="12" md="6" v-if="hotelId">
          <p class="text-h6 font-weight-regular pt-3">Gateways de pagamento</p>
          <PaymentGatewayList :hotel-id="hotelId" />
        </v-col>
      </v-row>
    </template>
  </Page>

  <PaymentGatewayAddDialog v-model="addGatewayDialog" :hotel-id="hotelId" />
</template>

<script setup lang="ts">
import Page from '@/components/Page.vue';
import DetailsTable from '@/components/DetailsTable.vue';
import PaymentGatewayList from '@/components/PaymentGatewayList.vue';
import PaymentGatewayAddDialog from '@/components/PaymentGatewayAddDialog.vue';
import { useCurrentHotel, useListHotels } from '@/services/hotel';
import { useUser } from '@/services/user';
import { ref, computed } from 'vue';

const { hotels } = useListHotels();
const { hotelId } = useCurrentHotel();

const currentHotel = computed(() => hotels.value?.find(hotel => hotel.id === hotelId.value));

const details = computed(() => [
  { title: 'Nome', icon: 'mdi-card-text-outline', value: currentHotel.value?.name ?? '' },
  { title: 'PMS', icon: 'mdi-database-outline', value: currentHotel.value?.pms ?? '' },
]);

const { hasPermission } = useUser();

const addGatewayDialog = ref<boolean>(false);
</script>
