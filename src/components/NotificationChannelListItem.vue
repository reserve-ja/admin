<template>
  <v-card
    :title="channel.name"
    :subtitle="channelTypeName"
    :variant="selected ? 'tonal' : 'flat'"
    link
    class="rounded-lg mb-2"
  >
    <template #prepend>
      <v-avatar :icon="channelIcon" />
    </template>
    <template #append>
      <v-switch
        ref="switchRef"
        :model-value="channel.isEnabled"
        inset
        color="primary"
        hide-details
        @click.stop
        @update:model-value="toggle()"
        :disabled="isLoadingToggleChannel"
        :loading="isLoadingToggleChannel"
      />
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { useToggleChannel } from '@/services/notification';
import { Channel, ChannelType } from '@/services/notification.types';
import { computed, ref } from 'vue'

const props = defineProps<{
  hotelId: string,
  channel: Channel,
  selected: boolean,
}>();

const channelTypeName = computed(() => {
  switch (props.channel.type) {
    case ChannelType.Email:
      return 'Email';
    default:
      return 'Indefinido';
  }
});

const channelIcon = computed(() => {
  switch (props.channel.type) {
    case ChannelType.Email:
      return 'mdi-email-outline';
    default:
      return 'mdi-bell-outline';
  }
});

const { toggleChannel, isLoadingToggleChannel } = useToggleChannel();
const toggle = async () => {
  await toggleChannel({ hotelId: props.hotelId , channel: props.channel })
}

</script>
