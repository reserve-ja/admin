<template>
  <v-skeleton-loader
    v-if="props.loading"
    type="list-item"
  />
  <v-select
    v-else-if="showHotelSelect"
    :model-value="currentHotel"
    @update:model-value="changeHotel"
    :items="hotels"
    hide-details
    item-title="name"
    item-value="id"
    return-object
    density="comfortable"
    variant="solo"
    menu-icon="mdi-unfold-more-horizontal"
    max-width="225"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useListHotels, useCurrentHotel } from '@/services/hotel';
import { Hotel } from '@/services/hotel.types';

interface Props {
  loading: boolean
}
const props = withDefaults(
  defineProps<Props>(),
  { loading: false }
);

const { hotels } = useListHotels();
const { hotelId, changeCurrentHotel } = useCurrentHotel();

const showHotelSelect = computed(() => {
  return (hotels.value?.length ?? 0) > 1;
});

const currentHotel = computed(() => {
  return hotels.value?.find(hotel => hotel.id === hotelId.value);
})

// const router = useRouter();
function changeHotel(hotel: Hotel) {
  changeCurrentHotel(hotel.id);
}
</script>
