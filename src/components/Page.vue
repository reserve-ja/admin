<template>
  <v-card
    scrollable
    variant="flat"
    ref="card"
    class="rounded-0 h-100"
    :class="{ 'mx-5': smAndUp, 'rounded-xl': smAndUp }"
  >
    <v-card-item class="page-top-bar py-3 px-4 border-b-thin" :class="{ 'pl-2': previousRoute || $slots.prepend, 'mt-3': smAndUp }">
      <v-card-title class="d-flex align-center">
        <v-btn v-if="previousRoute" :to="previousRoute" exact icon="mdi-arrow-left" variant="text" />
        <slot name="prepend"></slot>
        <span class="font-weight-regular">{{ title }}</span>
      </v-card-title>

      <template v-slot:append>
        <slot name="actions"></slot>
      </template>
    </v-card-item>

    <div class="overflow-y-auto h-100 px-4 pt-6 pb-10" ref="content">
      <div class="mb-10">
        <slot></slot>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useDisplay } from 'vuetify';

defineProps<{
  title: string,
  icon?: string,
  previousRoute?: string,
}>();

const { smAndUp } = useDisplay();

const content = useTemplateRef<HTMLDivElement>("content");

const hasVerticalScrollbar = computed(() => {
  if (!content.value) return false;

  return content.value.scrollHeight > content.value.clientHeight;
});
// var hasHorizontalScrollbar = div.scrollWidth > div.clientWidth;
// var hasVerticalScrollbar = div.scrollHeight > div.clientHeight;
</script>
