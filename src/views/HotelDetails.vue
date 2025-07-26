<template>
  <Page title="Hotel">
    <template #actions>
      <v-menu v-if="smAndDown">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" size="small" />
        </template>

        <v-list>
          <v-list-item
            v-if="hasPermission(currentHotel?.id, 'hotel.write')"
            :to="{ name: 'HotelEdit' }"
            prepend-icon="mdi-pencil-outline"
            title="Editar"
          />
          <v-list-item
            v-if="hasPermission(currentHotel?.id, 'hotel.write')"
            title="Configurar PMS"
            prepend-icon="mdi-cog-outline"
            :to="{ name: 'HotelEditPmsConfig' }"
          />
          <v-list-item
            v-if="hasPermission(currentHotel?.id, 'hotel.write')"
            title="Novo Gateway"
            prepend-icon="mdi-plus-box-outline"
            @click="addGatewayDialog = true"
          ></v-list-item>
        </v-list>
      </v-menu>
      <div v-else>
        <v-btn
          v-if="hasPermission(currentHotel?.id, 'hotel.write')"
          variant="text"
          color="primary"
          class="mx-1"
          prepend-icon="mdi-pencil-outline"
          :to="{ name: 'HotelEdit' }"
          text="Editar"
        />
        <v-btn
          v-if="hasPermission(currentHotel?.id, 'hotel.write')"
          text="Configurar PMS"
          variant="text"
          class="mx-1"
          prepend-icon="mdi-cog-outline"
          :to="{ name: 'HotelEditPmsConfig' }"
        />
        <v-btn
          v-if="hasPermission(currentHotel?.id, 'hotel.write')"
          variant="text"
          class="mx-1"
          text="Novo Gateway"
          prepend-icon="mdi-plus-box-outline"
          @click="addGatewayDialog = true"
        />
      </div>
    </template>
    <template #default>
      <v-row class="">
        <v-col cols="12" md="6">
          <p class="text-h6 font-weight-regular">Detalhes</p>
          <DetailsTable :items="details" />
        </v-col>
        <v-col cols="12" md="6" v-if="hotelId">
          <p class="text-h6 font-weight-regular">Gateways de pagamento</p>
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
import { useDisplay } from 'vuetify';

const { hotels } = useListHotels();
const { hotelId } = useCurrentHotel();

const currentHotel = computed(() => hotels.value?.find(hotel => hotel.id === hotelId.value));

const details = computed(() => [
  { title: 'Nome', icon: 'mdi-card-text-outline', value: currentHotel.value?.name ?? '' },
  { title: 'PMS', icon: 'mdi-database-outline', value: currentHotel.value?.pms ?? '' },
]);

const { hasPermission } = useUser();

const addGatewayDialog = ref<boolean>(false);

const { smAndDown } = useDisplay();
</script>
