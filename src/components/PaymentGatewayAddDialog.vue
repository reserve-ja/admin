<template>
  <v-form ref="form">
    <Dialog title="Adicionar gateway" v-model="model" max-width="700" persistent>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="name"
            label="Nome"
            prepend-icon="mdi-text-short"
            :rules="[v => !!v || 'Nome é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="type"
            :items="[GatewayType.ApiPix, GatewayType.OpenPix]"
            label="Tipo"
            prepend-icon="mdi-label-outline"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="paymentMethod"
            :items="[PaymentMethod.Pix]"
            label="Método de pagamento"
            prepend-icon="mdi-cash"
          />
        </v-col>
      </v-row>
      <v-row v-if="type === GatewayType.ApiPix">
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="apiPixConfig.expirationInMinutes"
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
            v-model="apiPixConfig.pixKey"
            label="Chave PIX"
            prepend-icon="mdi-key-outline"
            :rules="[v => !!v || 'Chave PIX é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="apiPixConfig.baseUrl"
            label="Host"
            prepend-icon="mdi-link"
            :rules="[v => !!v || 'Host é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="apiPixConfig.authUrl"
            label="Host autenticação"
            prepend-icon="mdi-link-lock"
            :rules="[v => !!v || 'Host autenticação é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="apiPixConfig.clientId"
            label="Client ID"
            prepend-icon="mdi-identifier"
            :rules="[v => !!v || 'Client ID é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="apiPixConfig.clientSecret"
            label="Client secret"
            prepend-icon="mdi-form-textbox-password"
            :rules="[v => !!v || 'Client secret é obrigatório']"
          />
        </v-col>
      </v-row>
      <v-row v-if="type === GatewayType.OpenPix">
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="openPixConfig.expirationInMinutes"
            prepend-icon="mdi-clock-outline"
            label="Expiração QR Code"
            suffix="minutos"
            type="number"
            min="15"
            max="60"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="openPixConfig.appId"
            label="AppID"
            prepend-icon="mdi-key-outline"
            :rules="[v => !!v || 'AppID é obrigatório']"
          />
        </v-col>
      </v-row>

      <template #actions>
        <v-spacer />
        <v-btn @click="close">Cancelar</v-btn>
        <v-btn
          :loading="isLoadingAddGateway"
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
import { useAddGateway } from '@/services/payment';
import { ApiPixConfig, Gateway, GatewayType, OpenPixConfig, PaymentMethod } from '@/services/payment.types';
import { ref } from 'vue';

const model = defineModel<boolean>({ required: true });
const props = defineProps<{ hotelId: string }>();

const form = ref();
const name = ref<string>('');
const type = ref<GatewayType>(GatewayType.ApiPix);
const paymentMethod = ref<PaymentMethod>(PaymentMethod.Pix);
const apiPixConfig = ref<ApiPixConfig>(new ApiPixConfig());
const openPixConfig = ref<OpenPixConfig>(new OpenPixConfig());

async function close() {
  name.value = '';
  type.value = GatewayType.ApiPix;
  paymentMethod.value = PaymentMethod.Pix;
  apiPixConfig.value = new ApiPixConfig();
  openPixConfig.value = new OpenPixConfig();
  model.value = false;
}

const { addGateway, isLoadingAddGateway } = useAddGateway();
async function save() {
  const result = await form.value.validate();
  if (!result.valid) return;

  await addGateway({
    hotelId: props.hotelId,
    gateway: getGateway(),
  });

  model.value = false;
}

function getGateway(): Gateway {
  const baseGateway = {
    id: '',
    name: name.value,
    method: paymentMethod.value,
    isActive: false,
  }

  switch(type.value) {
    case GatewayType.ApiPix:
      return {
        ...baseGateway,
        type: GatewayType.ApiPix,
        configuration: apiPixConfig.value,
      }
    case GatewayType.OpenPix:
      return {
        ...baseGateway,
        type: GatewayType.OpenPix,
        configuration: openPixConfig.value,
      }
  }
}
</script>
