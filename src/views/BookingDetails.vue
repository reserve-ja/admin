<template>
  <PageLoading v-if="!hotels || hotels.length === 0 || isLoadingHotels || isLoadingBooking || isLoadingRooms" />
  <PageUnauthorized v-else-if="!hotels?.some(h => h.id == hotelId)" />
  <Page title="Reserva" previous-route="/bookings" v-else>
    <template #default>
      <v-row>
        <v-col cols="12" md="6">
          <p class="text-h6 font-weight-regular pt-3">Detalhes</p>
          <DetailsTable :items="details" />
        </v-col>
        <v-col cols="12" md="6">
          <p class="text-h6 font-weight-regular pt-3">Hóspede principal</p>
          <DetailsTable :items="guestDetails" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>

          <p class="text-h6 font-weight-regular pt-3">Quartos</p>
          <v-data-table
            :items="bookingRooms"
            :headers="roomsHeaders"
            items-per-page="-1"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip activator="parent" text="Ver diárias">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-list-box-outline"
                    variant="text"
                    @click="viewDetailedPrice(item.priceDetails)"
                  />
                </template>
              </v-tooltip>
            </template>
            <template #bottom></template>
          </v-data-table>
        </v-col>
      </v-row>
    </template>
  </Page>
  <BookingRoomPriceDetailsDialog
    v-model="detailedPriceDialog"
    :price-details="priceDetails"
  />
</template>

<script setup lang="ts">
import Page from '@/components/Page.vue';
import PageLoading from '@/components/PageLoading.vue';
import PageUnauthorized from '@/components/PageUnauthorized.vue';
import DetailsTable from '@/components/DetailsTable.vue';
import BookingRoomPriceDetailsDialog from '@/components/BookingRoomPriceDetailsDialog.vue';
import { useCurrentHotel, useListHotels } from '@/services/hotel';
import { computed, ref, watchEffect } from 'vue';
import { PriceDetails, translateStatus, useBookingDetails } from '@/services/booking';
import { useRooms } from '@/services/room';

const props = defineProps<{ hotelId: string, bookingId: string }>();

const hotelId = computed(() => props.hotelId);
const bookingId = computed(() => props.bookingId);
const { hotels, isLoadingHotels } = useListHotels();
const { changeCurrentHotel } = useCurrentHotel();

watchEffect(() => {
  if (!hotelId.value) return;
  if (!hotels.value || hotels.value.length === 0) return;
  if (!hotels.value.some(h => h.id == hotelId.value)) return;

  changeCurrentHotel(hotelId.value);
})

const { booking, isLoadingBooking } = useBookingDetails(hotelId, bookingId);
const { isLoadingRooms, roomName } = useRooms(hotelId);

const details = computed(() => [
  { icon: 'mdi-calendar-start-outline', title: 'Check In', value: booking.value?.checkin ?? '' },
  { icon: 'mdi-calendar-end-outline', title: 'Check Out', value: booking.value?.checkout ?? '' },
  { icon: 'mdi-check', title: 'Status', value: translateStatus(booking.value?.status) },
  { icon: 'mdi-account-multiple-outline', title: 'Hóspedes', value: booking.value?.rooms.reduce((acc, r) => acc + r.totalGuests, 0).toString() ?? '' },
  { icon: 'mdi-bed-outline', title: 'Quartos', value: booking.value?.rooms.length.toString() ?? '' },
  { icon: 'mdi-currency-usd', title: 'Total', value: booking.value?.rooms.reduce((acc, r) => acc + r.totalPrice, 0).toString() ?? '' },
]);

const guestDetails = computed(() => [
  { icon: 'mdi-account-outline', title: 'Nome', value: booking.value?.mainGuest.fullName ?? '' },
  { icon: 'mdi-email-outline', title: 'Email', value: booking.value?.mainGuest.email ?? '' },
  { icon: 'mdi-phone-outline', title: 'Telefone', value: booking.value?.mainGuest.phone ?? '' },
]);

const bookingRooms = computed(() => booking.value?.rooms.map(r => ({
  name: roomName.value(r.roomId),
  totalGuests: r.totalGuests,
  totalPrice: r.totalPrice,
  priceDetails: r.priceDetails,
})) ?? []);

const roomsHeaders = [
  { title: 'Quarto', value: 'name' },
  { title: 'Hóspedes', value: 'totalGuests' },
  { title: 'Total (R$)', value: 'totalPrice' },
  { title: 'Ações', value: 'actions', sortable: false },
];

const detailedPriceDialog = ref<boolean>(false);
const priceDetails = ref<PriceDetails[]>([]);
function viewDetailedPrice(item: PriceDetails[]) {
  priceDetails.value = item;
  detailedPriceDialog.value = true;
}
</script>
