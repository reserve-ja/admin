import { http } from "./http";
import { computed, ref } from "vue";
import * as Sentry from "@sentry/vue";

const user = ref<User>();

export function useUser() {
  function fetchUser() {
    return http.get<User>('/users/me').then(({ data }) => {
      user.value = data;
    });
  }

  function clearUser() {
    Sentry.setUser(null);
    user.value = undefined;
  }

  const hasPermission = computed(() => (hotelId: string|undefined, permission: PermissionKey) => {
    if (!hotelId) {
      return false;
    }

    if (isSuperAdmin.value === true) {
      return true;
    }

    return user.value?.permissionsByHotel[hotelId]?.includes(permission) ?? false;
  });

  const isSuperAdmin = computed(() => {
    return user.value?.isSuperAdmin ?? false;
  });

  return { user, hasPermission, isSuperAdmin, fetchUser, clearUser };
}

export interface User {
  id: string,
  externalId: string,
  email: string,
  isSuperAdmin: boolean,
  hotels: string[],
  permissionsByHotel: Record<string, PermissionKey[]>,
}

export type PermissionKey =
  'hotel.write';
