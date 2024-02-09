<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col
        v-for="(hotel, i) in hotels.data"
        :key="i"
        cols="auto"
      >
        <v-card
          @click="hotels.current = hotel"
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
  </v-container>
</template>

<script setup lang="ts">
import { hotels } from '@/services/hotel';
</script>
