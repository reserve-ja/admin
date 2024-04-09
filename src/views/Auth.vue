<template>
  <v-container class="h-screen bg-grey" fluid>
    <v-row justify="center" align="center" class="h-100">
      <v-col class="d-flex flex-column justify-center align-center">
        <v-card min-width="300">
          <v-card-text class="pa-8">
            <h1 class="text-center pb-6">M.B.E.</h1>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                variant="outlined"
                label="Email"
              />
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                variant="outlined"
                label="Senha"
                @click:append-inner="showPassword = !showPassword"
              />
              <v-btn
                :loading="loadingAuth"
                type="submit"
                color="primary"
                block
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

const email = ref('');
const password = ref('');
const showPassword = ref<boolean>(false);

const { loadingAuth, login } = useAuth();

function handleLogin() {
  login(email.value, password.value);
}
</script>
