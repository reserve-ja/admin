<template>
  <Page title="Reservas">
    <div class="d-flex w-100 overflow-x-auto">
      <!-- <v-chip rounded variant="outlined" class="mx-1" @click="search">
        <v-icon start>mdi-calendar-start-outline</v-icon>
        Check in de
        <span>:&nbsp;</span>
        <span class="font-weight-medium">2024-03-01</span>
      </v-chip> -->
      <ChipFilterDate
        v-model="checkinFrom"
        icon="mdi-calendar-start-outline"
        label="Check in de"
      />
      <ChipFilterDate
        v-model="checkinTo"
        icon="mdi-calendar-end-outline"
        label="Check in até"
      />
      <ChipFilterSelect
        v-model="status"
        :items="statusOptions"
        icon="mdi-check-circle-outline"
        label="Status"
      />
    </div>
    <v-data-table
      :items="items"
      :headers="headers"
      :sort-by="[{ key: 'creationTime', order: 'desc' }]"
      :loading="isLoadingBookings"
    >
      <template v-slot:[`item.id`]="{ item }">
        <router-link :to="`hotels/${hotelId}/bookings/${item.id}`">
          {{ item.id.substring(0, 8) }}
        </router-link>
      </template>
      <template v-slot:[`item.checkin`]="{ item }">
        {{ formatDate(item.checkin) }}
      </template>
      <template v-slot:[`item.checkout`]="{ item }">
        {{ formatDate(item.checkout) }}
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <BookingStatusChip :status="item.status ?? BookingStatus.Unknown" />
      </template>
      <template v-slot:[`item.creationTime`]="{ item }">
        {{ formatDateTime(item.creationTime) }}
      </template>
      <template v-slot:[`item.totalPrice`]="{ item }">
        {{ formatMoney(item.totalPrice) }}
      </template>
    </v-data-table>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/Page.vue';
import ChipFilterDate from '@/components/ChipFilterDate.vue';
import ChipFilterSelect from '@/components/ChipFilterSelect.vue';
import { Booking, BookingStatus, searchBookings, allStatus, translateStatus } from '@/services/booking';
import { PaymentMethod } from '@/services/payment.types';
import { useCurrentHotel } from '@/services/hotel';
import { formatMoney } from '@/services/money';
import { ref, computed, watchEffect } from 'vue';
import BookingStatusChip from '@/components/BookingStatusChip.vue';
import { formatDate, formatDateTime } from '@/services/date';

const checkinFrom = ref<Date>();
const checkinTo = ref<Date>();
const paymentMethod = ref<PaymentMethod>();
const status = ref<BookingStatus>();

const bookings = ref<Booking[]>([]);
const isLoadingBookings = ref<boolean>(false);

const items = computed(() => bookings.value.map(b => ({
  id: b.id,
  mainGuest: b.mainGuest.fullName,
  checkin: new Date(b.checkin),
  checkout: new Date(b.checkout),
  status: b.status,
  totalGuests: b.rooms.reduce((acc, r) => acc + r.totalGuests, 0),
  totalPrice: b.rooms.reduce((acc, r) => acc + r.totalPrice, 0),
  creationTime: new Date(b.creationTime),
})));

const { hotelId } = useCurrentHotel();

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nome', key: 'mainGuest' },
  { title: 'Hóspedes', key: 'totalGuests' },
  { title: 'Check In', key: 'checkin' },
  { title: 'Check Out', key: 'checkout' },
  { title: 'Reservado em', key: 'creationTime' },
  { title: 'Status', key: 'status' },
  { title: 'Total', key: 'totalPrice' },
]

const statusOptions = [
  { title: 'Tudo', value: undefined },
  ...allStatus().map(s => ({ title: translateStatus(s), value: s })),
];

watchEffect(() => {
  search();
});

async function search() {
  bookings.value = [];
  const { hotelId } = useCurrentHotel();
  if (!hotelId.value) return;

  isLoadingBookings.value = true;

  bookings.value = await searchBookings(
    hotelId.value,
    checkinFrom.value,
    checkinTo.value,
    paymentMethod.value,
    status.value
  );

  isLoadingBookings.value = false;
}
</script>
