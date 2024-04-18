<template>
  <v-chip
    :variant="model ? 'tonal' : 'outlined'"
    :prepend-icon="icon"
    rounded
    class="mx-1"
    @click="clickChip"
  >
    <span ref="chip" class="">
      {{ label + (model ? ': '  : '') }}
      <span class="font-weight-medium">{{ items.find(i => i.value == model)?.title }}</span>
    </span>
    <v-icon v-if="model" end @click="clear">mdi-close</v-icon>
  </v-chip>

  <v-menu
    :activator="chip"
    :close-on-content-click="false"
    transition="scale-transition"
    location="bottom"
    offset="10, 30"
  >
    <template v-slot:default="{ isActive }">
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :title="item.title"
          @click="selectItem(item, isActive)"
        />
      </v-list>
    </template>
  </v-menu>
</template>

<script setup lang="ts" generic="T">
import { ref, Ref } from 'vue';

type Item<T> = {
  title: string,
  value: T,
}

const model = defineModel<T>();
defineProps<{
  icon: string,
  label: string,
  items: Item<T>[],
}>();

const chip = ref();
const isPickerOpen = ref<boolean>(false);

// const readableDate = computed(() =>  model.value.toLocaleDateString());

// function selectDate(event: Date, isActive?: Ref<boolean>): void {
//   isPickerOpen.value = false;
//   model.value = event;
//   if (isActive) {
//     isActive.value = false;
//   }
// }

function selectItem(item: Item<T>, isActive: Ref<boolean>) {
  model.value = item.value;
  isActive.value = false;
}

function clear() {
  model.value = undefined;
}

function clickChip() {
  // does nothing, but makes the chip clickable
}
</script>
