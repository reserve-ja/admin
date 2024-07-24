<template>
  <v-table>
    <tbody>
      <tr
        v-for="(item, i) in items"
        :key="i"
      >
        <td class="text-medium-emphasis">
          <span class="d-flex">
            <v-icon start>{{ item.icon }}</v-icon>
            {{ item.title }}
          </span>
        </td>
        <td v-if="item.value in BookingStatus ">
          <BookingStatusChip :status="item.value as BookingStatus" />
        </td>
        <td v-else>
          {{ item.value }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { BookingStatus } from '@/services/booking';
import { PaymentStatus } from '@/services/payment.types';
import BookingStatusChip from './BookingStatusChip.vue';

type Value = string | number | PaymentStatus | BookingStatus;
type Item = { title: string, icon: string, value: Value };

defineProps<{ items: Item[] }>();
</script>
