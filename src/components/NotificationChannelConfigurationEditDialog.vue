<template>
  <Dialog title="Configurar canal" v-model="model" max-width="400" persistent>
    <v-form ref="form">
      <v-text-field
        v-model="editedChannel.name"
        label="Nome"
        prepend-icon="mdi-text-short"
        :rules="[v => !!v || 'Nome é obrigatório']"
        class="mb-4"
      />

      <v-text-field
        v-model="editedChannel.configuration.host"
        label="Host"
        prepend-icon="mdi-link"
        :rules="[v => !!v || 'Host é obrigatório']"
        class="mb-4"
      />

      <v-text-field
        v-model="editedChannel.configuration.port"
        type="number"
        label="Porta"
        prepend-icon="mdi-numeric"
        :rules="[v => !!v || 'Porta é obrigatória']"
        class="mb-4"
      />

      <v-text-field
        v-model="editedChannel.configuration.user"
        label="Usuário"
        prepend-icon="mdi-account-outline"
        :rules="[v => !!v || 'Usuário é obrigatório']"
        class="mb-4"
      />

      <v-text-field
        v-model="editedChannel.configuration.password"
        type="password"
        label="Senha"
        placeholder="••••••••"
        prepend-icon="mdi-lock-outline"
        class="mb-4"
      />
    </v-form>

    <template #actions>
      <v-spacer />
      <v-btn @click="cancel">Cancelar</v-btn>
      <v-btn
        :loading="isLoadingEditChannel"
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
import Dialog from '@/components/Dialog.vue';
import { useCurrentHotel } from '@/services/hotel';
import { useEditChannel } from '@/services/notification';
import { Channel, ChannelType, emptyChannel } from '@/services/notification.types';
import { ref, toRaw, watchEffect } from 'vue';

const model = defineModel<boolean>({ required: true });
const props = defineProps<{ channel: Channel }>();

const form = ref();
const editedChannel = ref<Channel>(emptyChannel());

const { hotelId } = useCurrentHotel();

watchEffect(() => {
  editedChannel.value = Object.assign({}, toRaw(props.channel));
});

const { editChannel, isLoadingEditChannel } = useEditChannel();
async function save() {
  const result = await form.value.validate();
  if (!result.valid) return;

  await editChannel({ hotelId: hotelId.value, channel: editedChannel.value });

  close();
}

function cancel() {
  close();
  editedChannel.value = Object.assign({}, toRaw(props.channel));
}

function close() {
  model.value = false;
}
</script>
