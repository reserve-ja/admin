<template>
  <Dialog title="Adicionar tarifa" v-model="model" max-width="600">
    <v-form ref="form">
      <v-row class="pb-4">
        <v-col cols="12" md="4" class="py-0">
          <DateInput
            v-model="start"
            label="Início"
            prepend-inner-icon="mdi-calendar-start-outline"
          />
        </v-col>
        <v-col cols="12" md="4" class="py-0">
          <DateInput
            v-model="end"
            label="Fim"
            prepend-inner-icon="mdi-calendar-end-outline"
          />
        </v-col>
        <v-col cols="12" md="4" class="py-0">
          <v-text-field
            v-model="defaultPrice"
            label="Preço padrão"
            prepend-inner-icon="mdi-currency-usd"
            type="number"
          />
        </v-col>
      </v-row>

      <div
        v-for="(price, i) in prices"
        :key="i"
      >
        <v-divider v-if="smAndDown && i > 0" class="my-3" />
        <div class="d-flex justify-center mt-5" :class="{ 'mt-10': smAndDown }">
          <!-- <v-icon class="ma-3">mdi-currency-usd</v-icon> -->
          <v-row>
            <v-col cols="12" md="4" class="py-0">
              <v-select
                v-model="price.paymentMethod"
                :items="paymentMethods"
                label="Método"
                density="compact"
                item-title="name"
                item-value="id"
              />
            </v-col>
            <v-col cols="12" md="4" class="py-0">
              <v-number-input
                label="Ocupação"
                density="compact"
                v-model="price.guests"
                readonly
                :min="1"
              >
                <template #decrement="{ click }">
                  <v-btn @click="click" variant="text" icon="mdi-chevron-down" />
                </template>
                <template #increment="{ click }">
                  <v-btn @click="click" variant="text" icon="mdi-chevron-up" />
                </template>
              </v-number-input>
            </v-col>
            <v-col cols="12" md="4" class="py-0">
              <v-text-field
                label="Preço (R$)"
                density="compact"
                v-model="price.amount"
                type="number"
              />
            </v-col>
          </v-row>
          <v-btn
            icon="mdi-trash-can-outline"
            variant="text"
            class="ml-1 mt-n4"
            @click="removePrice(i)"
          />
        </div>
      </div>

      <v-btn
        variant="tonal"
        block
        @click="addPrice"
        :class="{ 'mt-4': prices.length > 0 }"
      >
        Adicionar preço detalhado
      </v-btn>
    </v-form>

    <template #actions>
      <v-spacer />
      <v-btn @click="model = false">Cancelar</v-btn>
      <v-btn
        :loading="isLoadingAddRate"
        color="primary"
        variant="elevated"
        class="px-4"
        @click="save"
      >
        Salvar
      </v-btn>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import DateInput from '@/components/DateInput.vue';
import Dialog from '@/components/Dialog.vue';
import { useCurrentHotel } from '@/services/hotel';
import { useRooms, useAddRate } from '@/services/room';
import { Room, RatePrice } from '@/services/room.types';
import { computed } from 'vue';
import { ref } from 'vue';
import { useDisplay } from 'vuetify';

const model = defineModel<boolean>({ required: true });
const props = defineProps<{ roomId: string }>();

const { hotelId } = useCurrentHotel();
const { rooms } = useRooms(hotelId);
const room = computed(() => rooms.value?.find((room: Room) => room.id === props.roomId));

const form = ref();
const start = ref<Date>(new Date());
const end = ref<Date>(new Date());
const defaultPrice = ref<number>(0);
const prices = ref<RatePrice[]>([]);

const paymentMethods = [
  { id: 'Pix', name: 'Pix' },
  { id: 'CreditCard', name: 'Cartão de Crédito' },
];

function addPrice() {
  prices.value.push({
    paymentMethod: 'Pix',
    guests: room.value?.capacity ?? 1,
    amount: defaultPrice.value ?? 0
  });
}

function removePrice(index: number) {
  prices.value.splice(index, 1);
}

const { addRate, isLoadingAddRate } = useAddRate();
async function save() {
  console.log('submiting');
  const result = await form.value.validate();
  if (!result.valid) return;
  // if (currentHotel.value === undefined) return;

  await addRate({
    hotelId: hotelId.value,
    roomId: props.roomId,
    start: start.value,
    end: end.value,
    defaultPrice: defaultPrice.value,
    prices: prices.value,
  });

  model.value = false;
}

const { smAndDown } = useDisplay();
</script>
