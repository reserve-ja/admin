<template>
  <v-form>
    <v-text-field
      :model-value="currentHotel?.name"
      readonly
    />
    <v-select
      v-model="formData.pms"
      :items="availablePms"
      item-title="name"
      item-value="id"
    />
  </v-form>
  <div>
    {{ currentHotel }}
  </div>
  <div>{{ formData.pms }}</div>
</template>

<script setup lang="ts">
// import { useCurrentHotel } from '@/services/hotel';
import { useCurrentHotel, useListHotels } from '@/services/hotel';
import { computed } from 'vue';
import { ref } from 'vue';

// const { currentHotel } = useCurrentHotel();
const { hotels } = useListHotels();
const { hotelId } = useCurrentHotel();

const currentHotel = computed(() => hotels.value?.find(hotel => hotel.id === hotelId.value));

const formData = ref({
  hotelId: currentHotel.value?.id,
  pms: currentHotel.value?.pms,
  configuration: currentHotel.value?.configuration,
});

const availablePms = [
  { id: 'None', name: 'Nenhum' },
  { id: 'Letoh', name: 'MDE Letoh' },
];
</script>
