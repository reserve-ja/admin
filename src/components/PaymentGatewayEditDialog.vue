<template>
  <v-form ref="form">
    <Dialog title="Configurar gateway" v-model="model" max-width="700" persistent>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="newName"
            label="Nome"
            prepend-icon="mdi-text-short"
            :rules="[v => !!v || 'Nome é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            :model-value="gateway.type"
            :items="[GatewayType.PixApi]"
            label="Tipo"
            prepend-icon="mdi-label-outline"
            disabled
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="newMethod"
            :items="[PaymentMethod.Pix]"
            label="Método de pagamento"
            prepend-icon="mdi-cash"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newConfiguration.expirationInMinutes"
            prepend-icon="mdi-clock-outline"
            label="Expiração QR Code"
            suffix="minutos"
            type="number"
            min="10"
            max="60"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newConfiguration.pixKey"
            label="Chave PIX"
            prepend-icon="mdi-key-outline"
            :rules="[v => !!v || 'Chave PIX é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newConfiguration.baseUrl"
            label="Host"
            prepend-icon="mdi-link"
            :rules="[v => !!v || 'Host é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newConfiguration.authUrl"
            label="Host autenticação"
            prepend-icon="mdi-link-lock"
            :rules="[v => !!v || 'Host autenticação é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newConfiguration.clientId"
            label="Client ID"
            prepend-icon="mdi-identifier"
            :rules="[v => !!v || 'Client ID é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newConfiguration.clientSecret"
            label="Client secret"
            prepend-icon="mdi-form-textbox-password"
            :rules="[v => !!v || 'Client secret é obrigatório']"
          />
        </v-col>
      </v-row>

      <template #actions>
        <v-spacer />
        <v-btn @click="cancel">Cancelar</v-btn>
        <v-btn
          :loading="isLoadingEditGateway"
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
import { useEditGateway } from '@/services/payment';
import { PixApiConfig, GatewayConfig, Gateway, GatewayType, PaymentMethod } from '@/services/payment.types';
import { ref, watchEffect } from 'vue';

const model = defineModel<boolean>({ required: true });
const props = defineProps<{ gateway: Gateway }>();
const { hotelId } = useCurrentHotel();

const form = ref();
const newName = ref<string>(props.gateway.name);
const newMethod = ref<PaymentMethod>(PaymentMethod.Pix);
const newConfiguration = ref<GatewayConfig>(new PixApiConfig());

const { editGateway, isLoadingEditGateway } = useEditGateway();
async function save() {
  const result = await form.value.validate();
  if (!result.valid) return;

  await editGateway({
    hotelId: hotelId.value,
    gateway: {
      id: props.gateway.id,
      type: props.gateway.type,
      name: newName.value,
      method: newMethod.value,
      isActive: props.gateway.isActive,
      configuration: newConfiguration.value,
    },
  });

  model.value = false;
}

watchEffect(() => {
  reset();
});

function reset() {
  newName.value = props.gateway.name;
  newMethod.value = props.gateway.method;
  newConfiguration.value = { ...props.gateway.configuration };
}

function cancel() {
  reset();
  model.value = false;
}
</script>
