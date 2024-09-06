<template>
  <div v-if="props.status === BookingStatus.Unknown" />
  <v-chip v-else rounded="xl" :color="statusColor[props.status] ?? 'default'">
    {{ statusName[props.status] ?? props.status }}
  </v-chip>
</template>

<script setup lang="ts">
import { BookingStatus } from '@/services/booking';

const props = defineProps<{ status: BookingStatus }>();

const statusColor: Record<BookingStatus, string> = {
  [BookingStatus.WaitingPreBook]: 'warning',
  [BookingStatus.PreBooked]: 'warning',
  [BookingStatus.Booked]: 'success',
  [BookingStatus.Canceled]: 'error',
  [BookingStatus.Unknown]: ''
}

const statusName: Record<BookingStatus, string> = {
  [BookingStatus.WaitingPreBook]: 'Aguardando Pré-Reserva',
  [BookingStatus.PreBooked]: 'Pré-Reservado',
  [BookingStatus.Booked]: 'Reservado',
  [BookingStatus.Canceled]: 'Cancelado',
  [BookingStatus.Unknown]: ''
}
</script>
