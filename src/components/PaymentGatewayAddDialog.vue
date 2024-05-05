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
            :items="[GatewayType.PixApi]"
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
        <v-col cols="12" md="6">
          <v-text-field
            v-model="configuration.expirationInMinutes"
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
            v-model="configuration.pixKey"
            label="Chave PIX"
            prepend-icon="mdi-key-outline"
            :rules="[v => !!v || 'Chave PIX é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="configuration.baseUrl"
            label="Host"
            prepend-icon="mdi-link"
            :rules="[v => !!v || 'Host é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="configuration.authUrl"
            label="Host autenticação"
            prepend-icon="mdi-link-lock"
            :rules="[v => !!v || 'Host autenticação é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="configuration.clientId"
            label="Client ID"
            prepend-icon="mdi-identifier"
            :rules="[v => !!v || 'Client ID é obrigatório']"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="configuration.clientSecret"
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
import { PixApiConfig, GatewayConfig, GatewayType, PaymentMethod } from '@/services/payment.types';
import { ref } from 'vue';

const model = defineModel<boolean>({ required: true });
const props = defineProps<{ hotelId: string }>();

const form = ref();
const name = ref<string>('');
const type = ref<GatewayType>(GatewayType.PixApi);
const paymentMethod = ref<PaymentMethod>(PaymentMethod.Pix);
const configuration = ref<GatewayConfig>(new PixApiConfig());

async function cancel() {
  name.value = '';
  model.value = false;
}

const { addGateway, isLoadingAddGateway } = useAddGateway();
async function save() {
  const result = await form.value.validate();
  if (!result.valid) return;

  await addGateway({
    hotelId: props.hotelId,
    gateway: {
      id: '',
      name: name.value,
      type: type.value,
      method: paymentMethod.value,
      isActive: false,
      configuration: configuration.value,
    },
  });

  model.value = false;
}
</script>
