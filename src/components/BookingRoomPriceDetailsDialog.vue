<template>
  <Dialog title="Diárias" v-model="model" max-width="400">
    <v-table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Diária</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in dailyRates"
          :key="item.date"
        >
          <td>{{ item.date }}</td>
          <td>{{ formatMoney(item.rate) }}</td>
        </tr>
      </tbody>
    </v-table>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from '@/components/Dialog.vue';
import { PriceDetails } from '@/services/booking';
import { formatMoney } from '@/services/money';
import { computed } from 'vue';

const model = defineModel<boolean>({ required: true });
const props = defineProps<{ priceDetails: PriceDetails[] }>();

const dailyRates = computed(() => {
  const rates = [];
  for (const price of props.priceDetails) {
    const start = new Date(price.start);
    const end = new Date(price.end);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    for (let i = 0; i <= diff; i++) {
      rates.push({
        date: new Date(start.getTime() + i * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        rate: price.pricePerNight
      });
    }
  }
  return rates;
});
</script>
