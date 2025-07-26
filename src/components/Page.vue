<template>
  <div class="fill-height" :class="{ 'pb-5': smAndUp }">
    <v-sheet
      scrollable
      variant="flat"
      ref="card"
      class="rounded-0 fill-height d-flex flex-column"
      :class="{ 'mx-5': smAndUp, 'rounded-xl': smAndUp }"
    >
      <div
        class="d-flex align-center page-top-bar py-3 px-4 border-b-thin"
        :class="{ 'pl-2': previousRoute || $slots.prepend, 'pt-5': smAndUp }"
      >
        <v-btn v-if="previousRoute" :to="previousRoute" exact icon="mdi-arrow-left" variant="text" />
        <slot name="prepend"></slot>

        <span class="font-weight-regular">{{ title }}</span>

        <v-spacer />

        <slot name="actions"></slot>
      </div>
      <!--
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

      -->
      <div class="overflow-y-auto pa-4" ref="content">
        <slot></slot>
      </div>

      <div v-if="smAndUp" class="mt-auto pt-4">
      </div>
    </v-sheet>
  </div>
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
