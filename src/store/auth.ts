import { Session } from '@supabase/supabase-js'
import { ref } from 'vue'

export const session = ref<Session|null>(null);
