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
                <input type="submit" class="button block" :value="loading ? 'Loading' : 'Login'"
                    :disabled="loading" />
            </div>
        </div>
    </form>

    <h1 v-if="loading">Loading</h1>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from './../services/supabase'
import { loading } from '../store/auth'

const email = ref('')
const password = ref('')

const handleLogin = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
        console.log('after login')
        if (error) throw error
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message)
        }
    } finally {
        loading.value = false
    }
}
</script>
