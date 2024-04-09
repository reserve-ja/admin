import { Ref, ref } from "vue"
import { http } from "./http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { Rate, Room } from "./room.types";

export function useRooms(hotelId: Ref<string>) {
  return useQuery<Room[]>({
    queryKey: ['rooms', { hotelId }],
    queryFn: async () => {
      console.log(hotelId.value);
      if (!hotelId.value) {
        return [];
      }

      const { data } = await http.get(`/hotels/${hotelId.value}/rooms`);
      return data;
    }
  })
}

export function useSyncRooms(hotelId: string) {
  return useMutation({
    mutationFn: () => http.post(`/hotels/${hotelId}/rooms/import-from-pms`),
    onSuccess: () => {
      useQueryClient().invalidateQueries({ queryKey: ['rooms', { hotelId }]});
    },
  });
}

export function useRoomRates(hotelId: Ref<string>, roomId: Ref<string>) {
  return useQuery<Rate[]>({
    queryKey: [ 'rates', { hotelId, roomId } ],
    queryFn: async () => {
      if (!hotelId.value || !roomId.value) {
        return [];
      }

      const { data } = await http.get(`/hotels/${hotelId.value}/rooms/${roomId.value}/rates`);
      return data;
    }
  });
}
