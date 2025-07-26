<template>
    <!-- <v-container class="overflow-y-auto overflow-x-auto h-100 position-relative pt-0" fluid>
      <div class="position-absolute top-0 left-0 right-0 bg-primary pa-3 w-100 header mb-5">
        Sticky header
      </div>

      <v-card title="Apartamento Solteiro"
        v-for="k in 5"
        :key="k"
      >
        <v-data-table
          :headers="headers"
          :items="items"
          hide-default-footer
          id="table"
          class="fixed-columns"
        />
      </v-card>
    </v-container> -->
  <Page title="Calendário">
    <template #actions>
      <v-date-input
        v-model="dates"
        multiple="range"
        input-format="dd/mm/yyyy"
        max-width="320"
        prepend-icon=""
        prepend-inner-icon="$calendar"
        hide-details
        density="compact"
        @update:model-value="updateDates"
      />
    </template>
    <v-container class="overflow-y-auto overflow-x-auto h-100 position-relative pt-0" fluid>
      <span v-if="isLoading">Carregando...</span>
      <v-table
        v-else
        fixed-header
        density="compact"
        class="overflow-x-auto w-100"
        style="table-layout: fixed;"
      >
        <thead>
          <tr>
            <th class="text-left"></th>
            <th
              v-for="header in headers"
              :key="header.value"
              class="text-center"
              :class="isWeekend(header.value) ? 'bg-blue-grey-lighten-4' : ''"
            >
              <p>{{ header.title }}</p>
              <p class="text-caption">{{ header.subtitle }}</p>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="room in rooms">
            <tr class="bg-grey-lighten-3">
              <th class="header-cell">
                <div class="d-flex align-center justify-space-between">
                  {{ getRoom(room.id)?.name }}
                  <v-btn
                    icon
                    size="x-small"
                    @click="openAddRateDialog(room.id)"
                  >
                    <v-icon small>mdi-plus</v-icon>
                  </v-btn>
                </div>
              </th>
              <td
                v-for="(header, i) in headers"
                :key="header.value"
                class="price-cell pa-1"
                :class="isWeekend(header.value) ? 'bg-blue-grey-lighten-4' : ''"
              >
                <!-- <v-btn
                  v-if="i === 0"
                  icon
                  size="x-small"
                  @click="openAddRateDialog(room.id)"
                >
                  <v-icon small>mdi-plus</v-icon>
                </v-btn> -->
              </td>
            </tr>
            <tr v-for="ratePlan in ratePlans" :key="ratePlan.id">
              <td class="header-cell">{{ getRatePlan(ratePlan.id)?.name }}</td>
              <td
                v-for="header in headers"
                :key="header.value"
                class="price-cell pa-1"
                :class="isWeekend(header.value) ? 'bg-blue-grey-lighten-4' : ''"
              >
                <v-text-field
                  type="number"
                  density="compact"
                  hide-details
                  :loading="loadingUpdate[`${room.id}-${ratePlan.id}-${header.value}`]"
                  :disabled="loadingUpdate[`${room.id}-${ratePlan.id}-${header.value}`]"
                  :model-value="rates?.find(r =>
                    r.roomTypeId === room.id &&
                    r.ratePlanId === ratePlan.id &&
                    r.date === header.value &&
                    r.guests === room.capacity
                  )?.price || ''"
                  @blur="(e: FocusEvent ) => updateValue(room.id, ratePlan.id, header.value, (e.target as HTMLInputElement).value as unknown as number)"
                  bg-color="surface"
                />
              </td >

            </tr>
          </template>
        </tbody>
      </v-table>
    </v-container>
  </Page>

  <AddRateDialog v-model="addRateDialog" :room-id="addRateRoomId" />
</template>

<script setup lang="ts">
import AddRateDialog from '@/components/AddRateDialog.vue';
import Page from '@/components/Page.vue';
import { formatDateShort, formatWeekdayShort } from '@/services/date';
import { useCurrentHotel } from '@/services/hotel';
import { useRatePlans } from '@/services/rate-plan';
import { useRatesOnPeriod } from '@/services/rates';
import { useAddRate, useRemoveRate, useRooms } from '@/services/room';
import { Room, WeekDay } from '@/services/room.types';
import { computed, ref } from 'vue';

const today = new Date();
const dates = ref<Date[]>([...Array(7).keys()].map(i => {
  const date = new Date(today);
  date.setDate(today.getDate() + i);
  return date;
}));
const addRateDialog = ref<boolean>(false);
const addRateRoomId = ref<string>('');

const startDate = computed(() => {
  if (dates.value && dates.value.length > 0) {
    return dates.value[0];
  }
  return null;
});
const endDate = computed(() => {
  if (dates.value && dates.value.length > 1) {
    return dates.value[dates.value.length - 1];
  }
  return null;
});

const updateDates = (newDates: Date[]) => {
  // transform the last date that is D+1 02:59:59 GMT to D 03:00:00 GMT
  if (newDates.length > 0) {
    const lastDate = new Date(newDates[newDates.length - 1]);
    lastDate.setHours(3, 0, 0, 0); // Set
    newDates[newDates.length - 1] = lastDate;
  }
  dates.value = newDates;
};

const { hotelId } = useCurrentHotel();
const { rates, isLoadingRates } = useRatesOnPeriod(hotelId, startDate, endDate);
const { rooms, isLoadingRooms } = useRooms(hotelId);
const { ratePlans, isLoadingRatePlans } = useRatePlans(hotelId);
const getRoom = (roomId: string) => rooms.value?.find((room: Room) => room.id === roomId);
const getRatePlan = (ratePlanId: string) => ratePlans.value?.find(rp => rp.id === ratePlanId);
const loadingUpdate = ref<{ [key: string]: boolean }>({})

const isLoading = computed(() => isLoadingRates.value || isLoadingRooms.value || isLoadingRatePlans.value);

const { addRate } = useAddRate();
const { removeRate } = useRemoveRate();
const updateValue = async (roomId: string, ratePlanId: string, date: string, price: number) => {
  const newPrice = Number(price) || 0;
  if (newPrice === (rates.value?.find(r =>
    r.roomTypeId === roomId &&
    r.ratePlanId === ratePlanId &&
    r.date === date &&
    r.guests === getRoom(roomId)?.capacity
  )?.price ?? 0)) {
    return; // No change in price, do nothing
  }

  loadingUpdate.value[`${roomId}-${ratePlanId}-${date}`] = true;
  if (!newPrice) {
    await removeRate({
      hotelId: hotelId.value,
      roomId,
      rateId: rates.value?.find(r =>
        r.roomTypeId === roomId &&
        r.ratePlanId === ratePlanId &&
        r.date === date &&
        r.guests === getRoom(roomId)?.capacity
      )?.id ?? '',
    });
    loadingUpdate.value[`${roomId}-${ratePlanId}-${date}`] = false;
    return;
  }

  await addRate({
    hotelId: hotelId.value,
    roomId,
    ratePlanId,
    start: new Date(date),
    end: new Date(date),
    weekDays: [WeekDay.Sunday, WeekDay.Monday, WeekDay.Tuesday, WeekDay.Wednesday, WeekDay.Thursday, WeekDay.Friday, WeekDay.Saturday],
    guests: getRoom(roomId)?.capacity ?? 0,
    price: newPrice,
  });
  loadingUpdate.value[`${roomId}-${ratePlanId}-${date}`] = false;
};

const openAddRateDialog = (roomId: string) => {
  addRateRoomId.value = roomId;
  addRateDialog.value = true;
};

const headers = computed(() =>
  dates.value.map(d => ({
    title: formatDateShort(d),
    subtitle: formatWeekdayShort(d),
    value: d.toISOString().split('T')[0] // Format to YYYY-MM-DD
  }))
);

const isWeekend = (date: string) => {
  const d = new Date(date);
  return d.getUTCDay() === 5 || d.getUTCDay() === 6;
};
</script>

<style>
.header-cell {
  min-width: 200px;
  max-width: 200px;
  width: 200px;
}

.price-cell {
  min-width: 100px;
  max-width: 100px;
  width: 100px;
}
</style>
