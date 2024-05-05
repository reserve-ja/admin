<template>
  <v-snackbar
    v-for="(error, index) in errors"
    :key="index"
    :timeout="7000"
    location="bottom right"
    :model-value="error == errors[0]"
    timer="red-lighten-1"
    @update:model-value="shiftError()"
  >
    {{ error.message }}

    <template #actions>
      <v-btn
        color="red-lighten-2"
        variant="text"
        @click="shiftError()"
      >
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useErrors } from '@/services/error';

const { errors, shiftError } = useErrors();
</script>
