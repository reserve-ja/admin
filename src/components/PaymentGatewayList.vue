<template>
   <v-list>
    <v-list-item
      v-for="gateway in gateways"
      :key="gateway.id"
    >
      <v-list-item-title>{{ gateway.name }}</v-list-item-title>
      <v-list-item-subtitle>{{ gateway.method }}</v-list-item-subtitle>

      <template v-slot:append>
        <v-btn
          variant="text"
          icon="mdi-cog"
          @click="openEditDialog(gateway)"
        />
        <v-list-item-action end>
          <v-switch
            :model-value="gateway.isActive"
            color="primary"
            hide-details
            @update:model-value="toggle(gateway)"
            :disabled="isLoadingToggleGateway"
            :loading="isBeingToggled(gateway.id)"
          />
        </v-list-item-action>
      </template>

      <PaymentGatewayEditDialog
        v-if="editGatewayDialog[gateway.id]"
        v-model="editGatewayDialog[gateway.id]"
        :gateway="gateway"
      />
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import PaymentGatewayEditDialog from '@/components/PaymentGatewayEditDialog.vue';
import { useGateways, useToggleGateway } from '@/services/payment';
import { Gateway } from '@/services/payment.types';
import { computed, ref, watchEffect } from 'vue';

const props = defineProps<{ hotelId: string }>();
const hotelId = computed(() => props.hotelId);

const { gateways } = useGateways(hotelId);
const { toggleGateway, isBeingToggled, isLoadingToggleGateway } = useToggleGateway();

const toggle = async (gateway: Gateway) => {
  await toggleGateway({ hotelId: hotelId.value, gateway });
};

watchEffect(() => {
  gateways.value?.forEach(gateway => {
    editGatewayDialog.value[gateway.id] = false;
  });
});

const editGatewayDialog = ref<Record<string, boolean>>({});

function openEditDialog(gateway: Gateway) {
  editGatewayDialog.value[gateway.id] = true;
}
</script>
