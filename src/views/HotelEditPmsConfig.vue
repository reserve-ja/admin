<template>
    <Page title="Configurar PMS" previous-route="/hotel">
    <template #default>
      <v-form @submit.prevent="save" v-model="isValid">
        <v-row>
          <v-col cols="12" md="6" lg="4">
            <v-select
              v-model="pms"
              :items="availablePms"
              label="PMS"
              item-title="name"
              item-value="id"
              class="pb-3"
            />
            <div v-if="pms === 'Letoh'">
              <v-text-field
                v-model="letohConfig.nrSerie"
                label="Nr. Série"
                :rules="[validateLetohNrSerie]"
                class="pb-3"
              />
              <v-text-field
                v-model="letohConfig.host"
                label="Host"
                class="pb-3"
              />
              <v-text-field
                v-model="letohConfig.username"
                label="Usuário"
                class="pb-3"
              />
              <v-text-field
                v-model="letohConfig.password"
                label="Senha"
                type="password"
                class="pb-3"
              />
            </div>
            <div class="d-flex">
              <v-spacer></v-spacer>
              <v-btn variant="text" class="mr-2" @click="cancel">Cancelar</v-btn>
              <v-btn color="primary" type="submit" :loading="isLoadingSetupPms">Salvar</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </Page>

</template>

<script setup lang="ts">
import Page from '@/components/Page.vue';
import { useCurrentHotel, useListHotels, useSetupPms } from '@/services/hotel';
import { Pms, NoneConfig, LetohConfig, PmsConfig, Hotel } from '@/services/hotel.types';
import { Ref } from 'vue';
import { watchEffect } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// const { currentHotel } = useCurrentHotel();
const { hotels } = useListHotels();
const { hotelId } = useCurrentHotel();

const currentHotel = computed(() => hotels.value?.find(hotel => hotel.id === hotelId.value));

const isValid = ref<boolean>();
const pms = ref<Pms>(currentHotel.value?.pms ?? 'None');
const noneConfig = ref<NoneConfig>(new NoneConfig());
const letohConfig = ref<LetohConfig>(new LetohConfig());

watchEffect(() => reset());

const router = useRouter();
function cancel() {
  reset();
  router.push({ name: 'HotelDetails' });
}

function reset() {
  if (currentHotel.value === undefined) return;

  const config: Ref<PmsConfig> =
    currentHotel.value.pms === 'Letoh' ? letohConfig :
    currentHotel.value.pms === 'None' ? noneConfig :
    noneConfig;

  pms.value = currentHotel.value.pms;

  noneConfig.value = new NoneConfig();
  letohConfig.value = new LetohConfig();
  config.value = { ...currentHotel.value.configuration };
}

function validateLetohNrSerie() {
  if (!letohConfig.value.nrSerie) {
    return 'Nr. Série é obrigatório.';
  }

  return true;
}

const { setupPms, isLoadingSetupPms } = useSetupPms();
async function save() {
  if (!isValid.value) return;
  if (currentHotel.value === undefined) return;

  const config: Ref<PmsConfig> =
    currentHotel.value.pms === 'Letoh' ? letohConfig :
    currentHotel.value.pms === 'None' ? noneConfig :
    noneConfig;

  await setupPms({
    hotelId: hotelId.value,
    pms: pms.value,
    configuration: config.value,
  });

  router.push({ name: 'HotelDetails' });
}

const availablePms = [
  { id: 'None', name: 'Nenhum' },
  { id: 'Letoh', name: 'MDE Letoh' },
];
</script>
