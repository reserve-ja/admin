<template>
  <v-form ref="form">
    <Dialog title="Editar quarto" v-model="model" max-width="400">
      <v-text-field
        v-model="newName"
        label="Nome"
        prepend-icon="mdi-text-short"
        :rules="[v => !!v || 'Nome do quarto é obrigatório']"
        class="pb-3"
      />
      <v-textarea
        v-model="newDescription"
        label="Descrição"
        prepend-icon="mdi-text-box-outline"
      />

      <template #actions>
        <v-spacer />
        <v-btn @click="cancel">Cancelar</v-btn>
        <v-btn
          :loading="isLoadingEditRoomDetails"
          color="primary"
          variant="elevated"
          class="px-4"
          @click="save"
        >
          Salvar
        </v-btn>
      </template>
    </Dialog>
  </v-form>
</template>

<script setup lang="ts">
import Dialog from '@/components/Dialog.vue';
import { useCurrentHotel } from '@/services/hotel';
import { useRooms, useEditRoomDetails } from '@/services/room';
import { Room } from '@/services/room.types';
import { watchEffect } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';

const model = defineModel<boolean>({ required: true });
const props = defineProps<{ roomId: string }>();

const { hotelId } = useCurrentHotel();
const { rooms } = useRooms(hotelId);
const room = computed(() => rooms.value?.find((room: Room) => room.id === props.roomId));

const form = ref();
const newName = ref<string>(room.value?.name ?? '');
const newDescription = ref<string>(room.value?.description ?? '');

watchEffect(() => {
  newName.value = room.value?.name ?? '';
  newDescription.value = room.value?.description ?? '';
});

async function cancel() {
  newName.value = room.value?.name ?? '';
  newDescription.value = room.value?.description ?? '';
  model.value = false;
}

const { editRoomDetails, isLoadingEditRoomDetails } = useEditRoomDetails();
async function save() {
  const result = await form.value.validate();
  if (!result.valid) return;

  await editRoomDetails({
    hotelId: hotelId.value,
    roomId: props.roomId,
    name: newName.value,
    description: newDescription.value,
  });

  model.value = false;
}
</script>
