<template>
  <Dialog title="Adicionar canal" v-model="model" max-width="400" persistent>
    <v-form ref="form">
      <v-text-field
        v-model="newChannel.name"
        label="Nome"
        prepend-icon="mdi-text-short"
        :rules="[v => !!v || 'Nome é obrigatório']"
        class="mb-4"
      />

      <v-select
        v-model="newChannel.type"
        :items="[ ChannelType.Email ]"
        label="Tipo"
        prepend-icon="mdi-label-outline"
        class="mb-4"
      />

      <v-text-field
        v-model="newChannel.configuration.host"
        label="Host"
        prepend-icon="mdi-link"
        :rules="[v => !!v || 'Host é obrigatório']"
        class="mb-4"
      />

      <v-text-field
        v-model="newChannel.configuration.port"
        type="number"
        label="Porta"
        prepend-icon="mdi-numeric"
        :rules="[v => !!v || 'Porta é obrigatória']"
        class="mb-4"
      />

      <v-text-field
        v-model="newChannel.configuration.user"
        label="Usuário"
        prepend-icon="mdi-account-outline"
        :rules="[v => !!v || 'Usuário é obrigatório']"
        class="mb-4"
      />

      <v-text-field
        v-model="newChannel.configuration.password"
        type="password"
        label="Senha"
        prepend-icon="mdi-lock-outline"
        :rules="[v => !!v || 'Senha é obrigatória']"
        class="mb-4"
      />
    </v-form>

    <template #actions>
      <v-spacer />
      <v-btn @click="close">Cancelar</v-btn>
      <v-btn
        :loading="isLoadingAddChannel"
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
import { useAddChannel } from '@/services/notification';
import { ChannelType, NewChannel } from '@/services/notification.types';
import { ref } from 'vue';

const model = defineModel<boolean>({ required: true });

const defaultChannel = {
  name: '',
  type: ChannelType.Email,
  configuration: { $type: 'email', host: '', port: 587, user: '', password: '' },
};

const form = ref();
const newChannel = ref<NewChannel>({ ...defaultChannel });

const { hotelId } = useCurrentHotel();

const { addChannel, isLoadingAddChannel } = useAddChannel();
async function save() {
  const result = await form.value.validate();
  if (!result.valid) return;

  await addChannel({ hotelId: hotelId.value, channel: newChannel.value });

  close();
}

function close() {
  newChannel.value = Object.assign({}, defaultChannel);
  model.value = false;
}
</script>
