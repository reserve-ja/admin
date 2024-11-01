<template>
  <v-dialog v-model="model" width="auto">
    <v-card
      max-width="420"
      title="Tem certeza?"
      text="Esta ação é permanente e não pode ser desfeita."
    >
      <v-card-actions class="py-3">
        <v-btn
          :disabled="loading"
          class="ms-auto"
          text="Cancelar"
          @click="model = false"
        />
        <v-btn
          :loading="loading"
          color="primary"
          variant="elevated"
          class="px-4"
          text="Confirmar"
          @click="$emit('confirm')"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const model = defineModel<boolean>();

const { loading = false } = defineProps<{ loading?: boolean }>();

defineEmits<{ confirm: [] }>();
</script>
