import { Ref, computed } from "vue"
import { http } from "./http";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { Rate, RatePrice, Room } from "./room.types";
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

  const roomName = computed(() => (roomId: string) => {
    return rooms.value?.find(r => r.id === roomId)?.name ?? '';
  });

  return { rooms, isLoadingRooms, roomName };
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

export function useEditRoomDetails() {
  const { mutateAsync: editRoomDetails, isPending: isLoadingEditRoomDetails } = useMutation({
    mutationFn: async (input: {
      hotelId: string,
      roomId: string,
      name: string,
      description: string,
     }) => {
      const { hotelId, roomId } = input;

      const { data } = await http.patch(`/hotels/${hotelId}/rooms/${roomId}`, {
        name: input.name,
        description: input.description,
      });

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ 'rooms', { hotelId: variables.hotelId } ],
        exact: true,
      });
    },
  });

  return { editRoomDetails, isLoadingEditRoomDetails };
}

export function useAddRate() {
  const { mutateAsync: addRate, isPending: isLoadingAddRate } = useMutation({
    mutationFn: async (input: {
      hotelId: string,
      roomId: string,
      start: Date,
      end: Date,
      defaultPrice: number,
      prices: RatePrice[],
     }) => {
      const { hotelId, roomId } = input;

      const { data } = await http.post(`/hotels/${hotelId}/rooms/${roomId}/rates`, {
        start: input.start.toISOString().substring(0, 10),
        end: input.end.toISOString().substring(0, 10),
        defaultPrice: input.defaultPrice,
        prices: input.prices,
      });

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ 'rates', { hotelId: variables.hotelId, roomId: variables.roomId } ],
        exact: true,
        refetchType: "all",
      });
    },
  });

  return { addRate, isLoadingAddRate };
}

export function useRemoveRate() {
  const { mutateAsync: removeRate, isPending: isLoadingRemoveRate } = useMutation({
    mutationFn: async (input: {
      hotelId: string,
      roomId: string,
      rateId: string,
     }) => {
      const { hotelId, roomId, rateId } = input;

      const { data } = await http.delete(`/hotels/${hotelId}/rooms/${roomId}/rates/${rateId}`);

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ 'rates', { hotelId: variables.hotelId, roomId: variables.roomId } ],
        exact: true,
        refetchType: "all",
      });
    },
  });

  return { removeRate, isLoadingRemoveRate };
}

// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
