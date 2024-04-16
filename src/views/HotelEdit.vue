<template>
  <PageLoading v-if="isLoadingHotels" />
  <PageUnauthorized v-else-if="!hasPermission(currentHotel?.id, 'hotel.write')" />
  <Page title="Editar hotel" previous-route="/hotel">
    <template #default>
      <v-form @submit.prevent="save" v-model="isValid">
        <v-row>
          <v-col cols="12" md="6" lg="4">
            <v-text-field
              v-model="name"
              label="Nome"
              :rules="[validateName]"
              class="pb-3"
            />
            <div class="d-flex">
              <v-spacer></v-spacer>
              <v-btn variant="text" class="mr-2" @click="cancel">Cancelar</v-btn>
              <v-btn color="primary" type="submit" :loading="isLoadingEditHotel">Salvar</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/Page.vue';
import PageLoading from '@/components/PageLoading.vue';
import PageUnauthorized from '@/components/PageUnauthorized.vue';
import { useCurrentHotel, useListHotels, useEditHotel } from '@/services/hotel';
import { useUser } from '@/services/user';
import { watchEffect } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { hasPermission } = useUser();

const { hotels, isLoadingHotels } = useListHotels();
const { hotelId } = useCurrentHotel();
const router = useRouter();

const currentHotel = computed(() => hotels.value?.find(hotel => hotel.id === hotelId.value));

const isValid = ref<boolean>();
const name = ref<string>(currentHotel.value?.name ?? '');

watchEffect(() => reset());

function cancel() {
  reset();
  router.push({ name: 'HotelDetails' });
}

function reset() {
  if (currentHotel.value === undefined) return;

  name.value = currentHotel.value.name;
}

function validateName() {
  if (!name.value) {
    return 'Nome é obrigatório.';
  }

  return true;
}

const { editHotel, isLoadingEditHotel } = useEditHotel();
async function save() {
  if (!isValid.value) return;
  if (currentHotel.value === undefined) return;

  await editHotel({
    hotelId: hotelId.value,
    name: name.value,
  });

  router.push({ name: 'HotelDetails' });
}
</script>
