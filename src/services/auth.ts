import { Session } from '@supabase/supabase-js'
import { ref } from 'vue'
import { supabase } from './supabase';

const session = ref<Session|null>(null);
const loadingAuth = ref<boolean>(false);

export function useAuth() {
  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      throw error;
    }

    session.value = null;
  }

  async function login(email: string, password: string) {
    loadingAuth.value = true

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('Error logging in:', error.message);
      loadingAuth.value = false
      throw error;
    }

    loadingAuth.value = false;
  }

  async function initAuth() {
    loadingAuth.value = true;

    supabase.auth.getSession();
    supabase.auth.onAuthStateChange(async (_, _session) => {
      if (_session != null && _session.user.id != session.value?.user.id) {
        session.value = _session;
      }
      loadingAuth.value = false;
    });
  }

  return {
    session,
    loadingAuth,
    initAuth,
    login,
    logout,
  };
}

