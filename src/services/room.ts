import { Ref, ref } from "vue"
import { http } from "./http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { Rate, Room } from "./room.types";
import { queryClient } from "./query";

export function useRooms(hotelId: Ref<string>) {
  const { data: rooms, isPending: isLoadingRooms } = useQuery<Room[]>({
    queryKey: ['rooms', { hotelId }],
    queryFn: async () => {
      console.log('fetching rooms', hotelId.value);
      if (!hotelId.value) {
        console.log('vazio')
        return [];
      }

      const { data } = await http.get(`/hotels/${hotelId.value}/rooms`);
      console.log('fetched')
      return data;
    }
  });

  return { rooms, isLoadingRooms };
}

export function useSyncRooms(hotelId: Ref<string>) {
  const { mutateAsync: syncRooms, isPending: isSyncing } = useMutation({
    mutationFn: async () => {
      return http.post(`/hotels/${hotelId.value}/rooms/import-from-pms`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', { hotelId: hotelId.value }]});
    },
  });

  return { syncRooms, isSyncing };
}

export function useRoomRates(hotelId: Ref<string>, roomId: Ref<string>) {
  const { data: rates, isPending: isLoadingRates } = useQuery<Rate[]>({
    queryKey: [ 'rates', { hotelId, roomId } ],
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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
