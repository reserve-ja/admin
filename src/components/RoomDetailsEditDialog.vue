<template>
  <v-form ref="form">
    <Dialog title="Editar quarto" v-model="model" max-width="600">
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

      <v-input
        prepend-icon="mdi-image-multiple-outline"
      >
        <p class="text-overline">IMAGENS</p>
      </v-input>
      <v-text-field
        v-for="(photo, i) in newPhotos"
        :key="i"
        v-model="photo.uri"
        label="URL da imagem"
        placeholder="https://exemplo.com.br/imagem.png"
        density="comfortable"
        prepend-icon="mdi-link"
        append-icon="mdi-close"
        @click:append="removePhoto(i)"
      />
      <div class="d-flex justify-center">
        <v-btn
          variant="text"
          @click="addPhoto"
          prepend-icon="mdi-image-plus-outline"
          class="text-center"
        >
          Adicionar imagem
        </v-btn>
      </div>

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

const transformPhoto = (photo: string) => ({ uri: photo });

const form = ref();
const newName = ref<string>(room.value?.name ?? '');
const newDescription = ref<string>(room.value?.description ?? '');
const newPhotos = ref<{ uri: string }[]>(room.value?.photos.map(transformPhoto) ?? []);

watchEffect(() => {
  newName.value = room.value?.name ?? '';
  newDescription.value = room.value?.description ?? '';
  newPhotos.value = room.value?.photos.map(transformPhoto) ?? [];
});

function addPhoto() {
  newPhotos.value.push({ uri: '' });
}

function removePhoto(index: number) {
  newPhotos.value.splice(index, 1);
}

async function cancel() {
  newName.value = room.value?.name ?? '';
  newDescription.value = room.value?.description ?? '';
  newPhotos.value = room.value?.photos.map(transformPhoto) ?? [];
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
    photos: newPhotos.value.map(photo => photo.uri),
  });

  model.value = false;
}
</script>
