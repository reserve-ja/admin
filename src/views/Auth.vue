<template>
  <v-container class="h-screen" fluid>
    <v-row justify="center" align="center" class="h-100">
      <v-col class="d-flex flex-column justify-center align-center">
        <v-card min-width="300" class="rounded-xl">
          <v-card-text class="pa-8">
            <h1 class="text-center pb-6">Reserve Já</h1>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Email"
              />
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                label="Senha"
                @click:append-inner="showPassword = !showPassword"
              />
              <v-btn
                :loading="loadingAuth"
                type="submit"
                color="primary"
                block
                rounded
                class="text-none"
              >
                Entrar
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../services/auth'

const email = ref(localStorage.getItem('previousEmail') ?? '');
const password = ref('');
const showPassword = ref<boolean>(false);

const { loadingAuth, login } = useAuth();

function handleLogin() {
  localStorage.setItem('previousEmail', email.value);
  login(email.value, password.value);
}
</script>
