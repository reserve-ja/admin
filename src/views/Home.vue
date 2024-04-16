<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col
        v-for="(hotel, i) in hotels"
        :key="i"
        cols="auto"
      >
        <v-card
          @click="changeHotel(hotel)"
          class="mx-auto"
          max-width="344"
          min-width="344"
          color="indigo-darken-3"
        >
          <v-card-item>
            <div class="text-overline mb-1">Hotel</div>
            <div class="text-h6 mb-1">{{ hotel.name }}</div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  <pre class="text-wrap">
  </pre>
  </v-container>
</template>

<script setup lang="ts">
import { useCurrentHotel, useListHotels } from '@/services/hotel';
import { Hotel } from '@/services/hotel.types';
import { useRouter } from 'vue-router';

const router = useRouter();

const { hotels } = useListHotels();
const { changeCurrentHotel } = useCurrentHotel();

function changeHotel(hotel: Hotel) {
  changeCurrentHotel(hotel.id);
  router.push({ name: 'HotelDetails' });
}
</script>
