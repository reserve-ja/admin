<template>
  <Page :title="channel.name" icon="mdi-email-outline">
    <template #prepend v-if="smAndDown">
      <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('close')"/>
    </template>

    <template #actions>
      <v-btn
        icon="mdi-cog-outline"
        variant="text"
        size="small"
        @click="editModal = true"
      />
      <v-btn
        icon="mdi-delete-outline"
        variant="text"
        size="small"
        @click="deleteModal = true"
      />
    </template>

    <v-list class="pa-0" lines="three">
      <v-list-item
        title="Confirmação de reserva"
        subtitle="Notifica o hóspede que a reserva foi feita com sucesso. Inclui dados como checkin e checkout."
      >
        <template #append>
          <v-list-item-action end>
            <v-switch
              :model-value="channel.shouldNotifyBookingConfirmation"
              :disabled="isLoadingEditChannel || isLoadingChannels"
              :loading="isLoadingEditChannel || isLoadingChannels"
              inset
              color="primary"
              hide-details
              @update:model-value="toggleShouldNotifyBookingConfirmation()"
            />
          </v-list-item-action>
        </template>
      </v-list-item>
      <v-list-item
        title="Nova reserva"
        subtitle="Notifica a recepção do hotel que novas reservas foram feitas através do site."
      >
        <template #append>
          <v-list-item-action end>
            <v-switch
              :model-value="channel.shouldNotifyBookingConfirmationToHotel"
              :disabled="isLoadingEditChannel || isLoadingChannels"
              :loading="isLoadingEditChannel || isLoadingChannels"
              inset
              color="primary"
              hide-details
              @update:model-value="toggleShouldNotifyBookingConfirmationToHotel()"
            />
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>

    <NotificationChannelConfigurationEditDialog
      v-model="editModal"
      :channel="channel"
    />
    <ConfirmationDialog
      v-model="deleteModal"
      :loading="isLoadingRemoveChannel"
      @confirm="deleteChannel"
    />
  </Page>
</template>

<script setup lang="ts">
import { Channel, emptyChannel } from '@/services/notification.types';
import Page from './Page.vue';
import { useChannels, useEditChannel, useRemoveChannel } from '@/services/notification';
import { onMounted, ref, toRaw, toRef } from 'vue';
import { watch } from 'vue';
import NotificationChannelConfigurationEditDialog from './NotificationChannelConfigurationEditDialog.vue';
import { useDisplay } from 'vuetify';
import ConfirmationDialog from './ConfirmationDialog.vue';

const props = defineProps<{ hotelId: string, channel: Channel }>();

defineEmits<{ close: [] }>();

const { editChannel, isLoadingEditChannel } = useEditChannel();
const { isLoadingChannels } = useChannels(toRef(props.hotelId));

const editedChannel = ref<Channel>(emptyChannel());
const editModal = ref<boolean>(false);
const deleteModal = ref<boolean>(false);

onMounted(() => {
  editedChannel.value = Object.assign({}, toRaw(props.channel));
})
watch(() => props.channel, () => {
  editedChannel.value = Object.assign({}, toRaw(props.channel));
})

function toggleShouldNotifyBookingConfirmation() {
  editedChannel.value.shouldNotifyBookingConfirmation = !editedChannel.value.shouldNotifyBookingConfirmation;
  saveEdit();
}

function toggleShouldNotifyBookingConfirmationToHotel() {
  editedChannel.value.shouldNotifyBookingConfirmationToHotel = !editedChannel.value.shouldNotifyBookingConfirmationToHotel;
  saveEdit();
}

async function saveEdit() {
  editedChannel.value.configuration.password = '';
  await editChannel({
    hotelId: props.hotelId,
    channel: editedChannel.value,
  });
  editedChannel.value = Object.assign({}, toRaw(props.channel));
}


const { removeChannel, isLoadingRemoveChannel } = useRemoveChannel();
async function deleteChannel() {
  await removeChannel({ hotelId: props.hotelId, channelId: props.channel.id });
  deleteModal.value = false;
}

const { smAndDown } = useDisplay();
</script>
