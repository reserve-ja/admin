<template>
    <form class="row flex-center flex" @submit.prevent="handleLogin">
        <div class="col-6 form-widget">
            <h1 class="header">M.B.E.</h1>
            <p class="description">Sign in your email below</p>
            <div>
                <input class="inputField" type="email" placeholder="Your email" v-model="email" />
            </div>
            <div>
                <input class="inputField" type="password" placeholder="Your password" v-model="password" />
            </div>
            <div>
                <input type="submit" class="button block" :value="loadingAuth ? 'Loading' : 'Login'"
                    :disabled="loadingAuth" />
            </div>
        </div>
    </form>

    <h1 v-if="loadingAuth">Loading</h1>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../services/auth'

const email = ref('')
const password = ref('')

const { loadingAuth, login } = useAuth();

function handleLogin() {
  login(email.value, password.value);
}
</script>
