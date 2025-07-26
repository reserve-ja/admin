import { computed, Ref } from "vue"
import { http } from "./http";
import { useQuery } from "@tanstack/vue-query";
import { Rate } from "./rates.types";

export function useRoomRates(hotelId: Ref<string>, roomId: Ref<string>) {
  const { data: rates, isPending: isLoadingRates } = useQuery<Rate[]>({
    queryKey: [ 'rates', hotelId, roomId ],
    queryFn: async () => {
      if (!hotelId.value || !roomId.value) {
        return [];
      }

      const { data } = await http.get(`/hotels/${hotelId.value}/rooms/${roomId.value}/rates`);
      return data;
    }
  });

  return { rates, isLoadingRates };
}

export function useRatesOnPeriod(hotelId: Ref<string>, startDate: Ref<Date|null>, endDate: Ref<Date|null>) {
  const { data: rates, isPending: isLoadingRates } = useQuery<Rate[]>({
    queryKey: [ 'rates', hotelId, startDate, endDate ],
    queryFn: async () => {
      const start = startDate.value?.toISOString().split('T')[0]; // format to YYYY-MM-DD
      const end = endDate.value?.toISOString().split('T')[0];     // format to YYYY-MM-DD
      if (!hotelId.value || !start || !end) {
        return [];
      }
      const { data } = await http.get(`/hotels/${hotelId.value}/rooms/rates`, {
        params: { startDate: start, endDate: end }
      });
      return data;
    },
    // enabled: (x) => computed(() => !!hotelId.value).value,
  });

  return { rates, isLoadingRates };
}
