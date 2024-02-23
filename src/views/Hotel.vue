<template>
  <v-form>
    <v-text-field
      :model-value="currentHotel?.name"
      readonly
    />
    <v-select
      v-model="formData.pms"
      :items="pms"
      item-title="name"
      item-value="id"
    />
  </v-form>
  <div>
    {{ currentHotel }}
  </div>
  <div>{{ pms }}</div>
</template>

<script setup lang="ts">
import { currentHotel, fetchAvailablePms, pms } from '@/services/hotel';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';

const formData = ref({
  hotelId: currentHotel.value?.id,
  pms: currentHotel.value?.pms,
  configuration: currentHotel.value?.configuration,
});

onMounted(async () => {
  await fetchAvailablePms();
});

onBeforeRouteUpdate((to, from) => {
})
</script>
