<template>
  <v-empty-state>
    <template v-slot:media>
      <v-icon color="surface-variant">mdi-lock-outline</v-icon>
    </template>

    <template v-slot:title>
      <div class="text-h6 text-high-emphasis">Acesso negado</div>
    </template>

    <template v-slot:text>
      <div class="text-body-1 pb-3">Você não tem permissão para acessar esta página.</div>
      <v-btn to="/">Página Inicial</v-btn>
    </template>
  </v-empty-state>
</template>
