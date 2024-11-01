<template>
  <PageLoading v-if="isLoadingUser || isLoadingHotels || isLoadingChannels" />
  <PageUnauthorized v-else-if="!hasPermission(currentHotel?.id, 'hotel.write')" />
  <v-row v-else class="ma-0 pa-0 fill-height">
    <v-col
      v-show="smAndUp || selectedChannel === undefined"
      cols="12"
      sm="4"
      :class="{ 'pa-3': !smAndUp, 'pa-0': smAndUp }"
    >
      <NotificationChannelListItem
        v-for="channel in channels"
        :key="channel.id"
        :hotel-id="hotelId"
        :channel="channel"
        :selected="channel.id === selectedChannelId"
        @click="selectChannel(channel)"
      />

      <v-btn
        variant="outlined"
        color="primary"
        block
        text="Adicionar canal"
        class="mt-5"
        @click="addChannelDialog = true"
      />
    </v-col>
    <v-col
      v-show="smAndUp || selectedChannel !== undefined"
      cols="12"
      sm="8"
      class="pa-0 ma-0"
    >
      <v-fade-transition>
        <NotificationChannelDetails
          v-if="selectedChannel !== undefined"
          :channel="selectedChannel"
          :hotel-id="hotelId"
          @close="selectedChannelId = null"
        />
      </v-fade-transition>
    </v-col>
  </v-row>
  <NotificationChannelAddDialog v-model="addChannelDialog" />
</template>

<script setup lang="ts">
import NotificationChannelAddDialog from '@/components/NotificationChannelAddDialog.vue';
import NotificationChannelDetails from '@/components/NotificationChannelDetails.vue';
import NotificationChannelListItem from '@/components/NotificationChannelListItem.vue';
import PageLoading from '@/components/PageLoading.vue';
import PageUnauthorized from '@/components/PageUnauthorized.vue';
import { useCurrentHotel, useListHotels } from '@/services/hotel';
import { useChannels } from '@/services/notification';
import { Channel } from '@/services/notification.types';
import { useUser } from '@/services/user';
import { computed, Ref, ref } from 'vue';
import { useDisplay } from 'vuetify';

const addChannelDialog = ref<boolean>(false);

// User
const { isLoadingUser, hasPermission } = useUser();

// Current hotel
const { hotels, isLoadingHotels } = useListHotels();
const { hotelId } = useCurrentHotel();
const currentHotel = computed(() => hotels.value?.find(hotel => hotel.id === hotelId.value));

// Channels
const { channels, isLoadingChannels } = useChannels(hotelId);
const selectedChannelId: Ref<string | null> = ref(null);

const selectedChannel = computed(() => channels.value?.find(channel => channel.id === selectedChannelId.value));

async function selectChannel(channel: Channel) {
  if (selectedChannelId.value === channel.id) {
    selectedChannelId.value = null;
  } else {
    selectedChannelId.value = null;
    selectedChannelId.value = channel.id;
  }
}

// Display
const { smAndUp } = useDisplay();

</script>
