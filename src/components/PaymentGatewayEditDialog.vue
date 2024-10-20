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
            :items="[GatewayType.ApiPix, GatewayType.OpenPix, GatewayType.Stripe]"
            label="Tipo"
            prepend-icon="mdi-label-outline"
            disabled
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="newMethod"
            :items="paymentMethods"
            item-value="method"
            item-title="label"
            label="Método de pagamento"
            prepend-icon="mdi-cash"
          />
        </v-col>
      </v-row>
      <v-row v-if="gateway.type === GatewayType.ApiPix">
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="newApiPixConfig.expirationInMinutes"
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
            v-model="newApiPixConfig.pixKey"
            label="Chave PIX"
            prepend-icon="mdi-key-outline"
            :rules="[v => !!v || 'Chave PIX é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newApiPixConfig.baseUrl"
            label="Host"
            prepend-icon="mdi-link"
            :rules="[v => !!v || 'Host é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newApiPixConfig.authUrl"
            label="Host autenticação"
            prepend-icon="mdi-link-lock"
            :rules="[v => !!v || 'Host autenticação é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newApiPixConfig.clientId"
            label="Client ID"
            prepend-icon="mdi-identifier"
            :rules="[v => !!v || 'Client ID é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newApiPixConfig.clientSecret"
            label="Client secret"
            prepend-icon="mdi-form-textbox-password"
            :rules="[v => !!v || 'Client secret é obrigatório']"
          />
        </v-col>
      </v-row>
      <v-row v-if="gateway.type === GatewayType.OpenPix">
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="newOpenPixConfig.expirationInMinutes"
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
            v-model="newOpenPixConfig.appId"
            label="AppId"
            prepend-icon="mdi-key-outline"
            :rules="[v => !!v || 'AppId é obrigatório']"
          />
        </v-col>
      </v-row>
      <v-row v-if="gateway.type === GatewayType.Stripe">
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="newStripeConfig.secretKey"
            prepend-icon="mdi-lock-outline"
            label="Secret Key"
            :rules="[(v: string) => !!v || 'Secret Key é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newStripeConfig.publishableKey"
            label="Publishable Key"
            prepend-icon="mdi-key-outline"
            :rules="[(v: string) => !!v || 'Publishable Key é obrigatório']"
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
import { ApiPixConfig, Gateway, GatewayType, PaymentMethod, OpenPixConfig, StripeConfig } from '@/services/payment.types';
import { ref, watchEffect } from 'vue';

const model = defineModel<boolean>({ required: true });
const props = defineProps<{ gateway: Gateway }>();
const { hotelId } = useCurrentHotel();

const form = ref();
const newName = ref<string>(props.gateway.name);
const newMethod = ref<PaymentMethod>(PaymentMethod.Pix);
const newApiPixConfig = ref<ApiPixConfig>(new ApiPixConfig());
const newOpenPixConfig = ref<OpenPixConfig>(new OpenPixConfig());
const newStripeConfig = ref<StripeConfig>(new StripeConfig());

const paymentMethods = [
  { method: PaymentMethod.Pix, label: 'Pix' },
  { method: PaymentMethod.CreditCard, label: 'Cartão de Crédito' },
]

const { editGateway, isLoadingEditGateway } = useEditGateway();
async function save() {
  const result = await form.value.validate();
  if (!result.valid) return;

  await editGateway({
    hotelId: hotelId.value,
    gateway: getGateway(),
  });

  model.value = false;
}

function getGateway(): Gateway {
  const baseGateway = {
    id: props.gateway.id,
    name: newName.value,
    method: newMethod.value,
    isActive: props.gateway.isActive,
  }

  switch(props.gateway.type) {
    case GatewayType.ApiPix:
      return {
        ...baseGateway,
        type: GatewayType.ApiPix,
        configuration: newApiPixConfig.value,
      }
    case GatewayType.OpenPix:
      return {
        ...baseGateway,
        type: GatewayType.OpenPix,
        configuration: newOpenPixConfig.value,
      }
    case GatewayType.Stripe:
      return {
        ...baseGateway,
        type: GatewayType.Stripe,
        configuration: newStripeConfig.value,
      }
  }
}

watchEffect(() => {
  reset();
});

function reset() {
  newName.value = props.gateway.name;
  newMethod.value = props.gateway.method;

  switch(props.gateway.type) {
    case GatewayType.ApiPix:
      newApiPixConfig.value = { ...props.gateway.configuration };
      break;
    case GatewayType.OpenPix:
      newOpenPixConfig.value = { ...props.gateway.configuration };
      break;
    case GatewayType.Stripe:
      newStripeConfig.value = { ...props.gateway.configuration };
      break;
  }
}

function cancel() {
  reset();
  model.value = false;
}
</script>
