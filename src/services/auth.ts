import { Session } from '@supabase/supabase-js'
import { ref } from 'vue'
import { supabase } from './supabase';
import { queryClient } from './query';
import { useCurrentHotel } from './hotel';
import { useUser } from './user';
import * as Sentry from "@sentry/vue";

const session = ref<Session|null>(null);
const loadingAuth = ref<boolean>(false);

export function useAuth() {
  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      throw error;
    }

    queryClient.clear();
    const { changeCurrentHotel } = useCurrentHotel();
    changeCurrentHotel('');
    useUser().clearUser();
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
    supabase.auth.onAuthStateChange(async (event, supabaseSession) => {
      if (supabaseSession != null) {
        session.value = supabaseSession;
        useUser().fetchUser();
      }

      Sentry.setUser({
        id: supabaseSession?.user.id,
        email: supabaseSession?.user.email,
      });

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

