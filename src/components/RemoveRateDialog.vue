<template>
  <v-dialog v-model="model" max-width="400">
    <v-card
      text="A tarifa deletada não poderá ser recuperada. Deseja continuar?"
      title="Remover tarifa"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="cancel" :disabled="isLoadingRemoveRate">
          Cancelar
        </v-btn>

        <v-btn
          :loading="isLoadingRemoveRate"
          color="error"
          @click="remove"
        >
          Remover tarifa
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useRemoveRate } from '@/services/room';

const model = defineModel<boolean>();
const props = defineProps<{ hotelId: string, roomId: string, rateId: string }>();

function cancel() {
  model.value = false;
}

const { removeRate, isLoadingRemoveRate } = useRemoveRate();
async function remove() {
  await removeRate({ ...props });
  model.value = false;
}
</script>
