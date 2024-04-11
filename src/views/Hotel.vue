<template>
  <Page title="Configurações" icon="mdi-cog">
    <template #actions>
      <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
    </template>
    <v-form>
      <v-text-field
        :model-value="currentHotel?.name"
        readonly
      />
      <v-select
        v-model="pms"
        :items="availablePms"
        item-title="name"
        item-value="id"
      />
      <div v-if="pms === 'Letoh'">
        <v-text-field
          v-model="letohConfig.nrSerie"
          label="Nr Serie"
        />
        <v-text-field
          v-model="letohConfig.host"
          label="Host"
        />
        <v-text-field
          v-model="letohConfig.username"
          label="Username"
        />
        <v-text-field
          v-model="letohConfig.password"
          label="Password"
        />
      </div>
      <v-btn color="primary" type="submit">Salvar</v-btn>
    </v-form>
    <div>{{ currentHotel }}</div>

  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/Page.vue';
import { useCurrentHotel, useListHotels } from '@/services/hotel';
import { Pms, NoneConfig, LetohConfig } from '@/services/hotel.types';
import { watchEffect } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';

// const { currentHotel } = useCurrentHotel();
const { hotels } = useListHotels();
const { hotelId } = useCurrentHotel();

const currentHotel = computed(() => hotels.value?.find(hotel => hotel.id === hotelId.value));

const pms = ref<Pms>(currentHotel.value?.pms ?? 'None');
const noneConfig: NoneConfig = {};
const letohConfig = ref<LetohConfig>({
  nrSerie: '',
  host: '',
  username: '',
  password: '',
});

watchEffect(() => {
  if (currentHotel.value === undefined) {
    return;
  }

  pms.value = currentHotel.value.pms;
  if (currentHotel.value.pms === 'None') {
    noneConfig.value = currentHotel.value.configuration;
  } else if (currentHotel.value.pms === 'Letoh') {
    letohConfig.value = currentHotel.value.configuration;
  }
});

const availablePms = [
  { id: 'None', name: 'Nenhum' },
  { id: 'Letoh', name: 'MDE Letoh' },
];
</script>
