import { ref } from "vue";
import { http } from "./http";

export const hotels = ref({
  current: null,
  data: null,
  loading: false,
  errors: null,
});

export function loadHotels() {
  return http.get("/hotels")
    .then(response => {
      hotels.value.data = response.data;
      hotels.value.current = response.data[0];
    })
    .catch((error) => {
      if (error.response) {
        hotels.value.errors = error.response.data;
      } else if (error.request) {
        console.error(error.request);
      } else {
        console.error('Error', error);
      }
    })
    .finally(() => hotels.value.loading = false)
}
