import { ref } from "vue";
import { http } from "./http";

export type Hotel = {
  id: string,
  name: string,
  pms: number,
  configuration: string,
}

export type Pms = {
  id: number,
  name: string,
}

export const hotels = ref<Hotel[]|null>(null);
export const currentHotel = ref<Hotel>({
  id: '',
  name: '',
  pms: 0,
  configuration: '',
});
export const loadingHotels = ref<boolean>(false);
export const errorHotels = ref<boolean>(false);

export const pms = ref<Pms[]>([]);
export const pmsLoading = ref<boolean>(false);

export async function fetchHotels() {
  loadingHotels.value = true;

  try {
    const response = await http.get<Hotel[]>("/hotels");
    hotels.value = response.data;
    currentHotel.value = response.data[0];
  } catch (error) {
    errorHotels.value = true;
  } finally {
    loadingHotels.value = false;
  }
}

export function fetchAvailablePms() {
  if (pms.value.length > 0) {
    return Promise.resolve();
  }

  pmsLoading.value = true;
  return http.get("/hotels/pms")
    .then(response => { pms.value = response.data; })
    .finally(() => pmsLoading.value = false)
}
