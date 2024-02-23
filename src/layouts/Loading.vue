<template>
  <v-app>
    <app-bar loading />
    <v-main class="ma-4">
      <v-container style="height: 90%">
        <v-row
          class="fill-height"
          align-content="center"
          justify="center"
        >
          <v-col
            class="text-subtitle-1 text-center"
            cols="12"
          >
            Carregando...
          </v-col>
          <v-col cols="6" md="2">
            <v-progress-linear
              color="primary"
              indeterminate
              rounded
              height="6"
            ></v-progress-linear>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
</script>
