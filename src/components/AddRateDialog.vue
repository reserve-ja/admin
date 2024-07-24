<template>
  <Dialog title="Adicionar tarifa" v-model="model" max-width="600">
    <v-form ref="form">
      <v-row>
        <v-col>
          <v-select
            prepend-inner-icon="mdi-label-outline"
            v-model="ratePlanId"
            label="Plano de tarifa"
            :items="ratePlans ?? []"
            item-title="name"
            item-value="id"
            hide-details
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <DateInput
            v-model="start"
            label="Início"
            prepend-inner-icon="mdi-calendar-start-outline"
            hide-details
          />
        </v-col>
        <v-col cols="12" md="6">
          <DateInput
            v-model="end"
            label="Fim"
            prepend-inner-icon="mdi-calendar-end-outline"
            hide-details
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-number-input
            v-model="guests"
            :min="1"
            :max="room?.capacity"
            label="Ocupação"
            readonly
            prepend-icon="mdi-account-multiple-outline"
          >
            <template #decrement="{ click }">
              <v-btn @click="click" variant="text" icon="mdi-chevron-down" />
            </template>
            <template #increment="{ click }">
              <v-btn @click="click" variant="text" icon="mdi-chevron-up" />
            </template>
          </v-number-input>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="price"
            label="Preço padrão"
            prepend-inner-icon="mdi-currency-usd"
            type="number"
          />
        </v-col>
      </v-row>
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
import { useRatePlans } from '@/services/rate-plan';
import { useRooms, useAddRate } from '@/services/room';
import { Room } from '@/services/room.types';
import { computed, watchEffect } from 'vue';
import { ref } from 'vue';

const model = defineModel<boolean>({ required: true });
const props = defineProps<{ roomId: string }>();

const { hotelId } = useCurrentHotel();
const { rooms } = useRooms(hotelId);
const { ratePlans } = useRatePlans(hotelId);

const room = computed(() => rooms.value?.find((room: Room) => room.id === props.roomId));

const form = ref();
const ratePlanId = ref<string>('');
const start = ref<Date>(new Date());
const end = ref<Date>(new Date());
const guests = ref<number>(0);
const price = ref<number>(0);

watchEffect(() => {
  guests.value = room.value?.capacity ?? 0;
})

watchEffect(() => {
  ratePlanId.value = ratePlans.value?.at(0)?.id ?? '';
})

const { addRate, isLoadingAddRate } = useAddRate();
async function save() {
  const result = await form.value.validate();
  if (!result.valid) return;
  // if (currentHotel.value === undefined) return;

  await addRate({
    hotelId: hotelId.value,
    roomId: props.roomId,
    ratePlanId: ratePlanId.value,
    start: start.value,
    end: end.value,
    guests: guests.value,
    price: price.value,
  });

  model.value = false;
}
</script>
