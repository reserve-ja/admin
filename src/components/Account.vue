<template>
  <div>{{ session }}</div>
</template>

<script setup lang="ts">
import { supabase } from '../services/supabase'
import { session } from '../store/auth';
</script>
