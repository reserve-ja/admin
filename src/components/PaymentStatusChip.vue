<template>
  <v-chip rounded="xl" :color="statusColor[props.status] ?? 'default'">
    {{ statusName[props.status] ?? props.status }}
  </v-chip>
</template>

<script setup lang="ts">
import { PaymentStatus } from '@/services/payment.types';

const props = defineProps<{ status: PaymentStatus }>();

const statusColor: Record<PaymentStatus, string> = {
  [PaymentStatus.Requested]: 'warning',
  [PaymentStatus.Paid]: 'success',
  [PaymentStatus.Canceled]: 'error',
  [PaymentStatus.Refunded]: ''
}

const statusName: Record<PaymentStatus, string> = {
  [PaymentStatus.Requested]: 'Aguardando Pagamento',
  [PaymentStatus.Paid]: 'Pago',
  [PaymentStatus.Canceled]: 'Cancelado',
  [PaymentStatus.Refunded]: 'Estornado',
}
</script>
