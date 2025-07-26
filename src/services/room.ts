import { Ref, computed } from "vue"
import { http } from "./http";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { Room, WeekDay } from "./room.types";
import { queryClient } from "./query";

export function useRooms(hotelId: Ref<string>) {
  const { data: rooms, isPending: isLoadingRooms } = useQuery<Room[]>({
    queryKey: ['rooms', { hotelId }],
    queryFn: async () => {
      if (!hotelId.value) {
        return [];
      }

      const { data } = await http.get(`/hotels/${hotelId.value}/rooms`);
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

export function useEditRoomDetails() {
  const { mutateAsync: editRoomDetails, isPending: isLoadingEditRoomDetails } = useMutation({
    mutationFn: async (input: {
      hotelId: string,
      roomId: string,
      name: string,
      description: string,
      photos: string[],
     }) => {
      const { hotelId, roomId } = input;

      const { data } = await http.patch(`/hotels/${hotelId}/rooms/${roomId}`, {
        name: input.name,
        description: input.description,
        photos: input.photos.map(p => p.trim()).filter(p => p.length > 0),
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
      ratePlanId: string,
      start: Date,
      end: Date,
      weekDays: WeekDay[],
      guests: number,
      price: number,
     }) => {
      const { hotelId, roomId } = input;

      const { data } = await http.post(`/hotels/${hotelId}/rooms/${roomId}/rates`, {
        ratePlanId: input.ratePlanId,
        start: input.start.toISOString().substring(0, 10),
        end: input.end.toISOString().substring(0, 10),
        weekDays: input.weekDays,
        guests: input.guests,
        price: input.price,
      });

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ 'rates' ],
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
        queryKey: [ 'rates' ],
        refetchType: "all",
      });
    },
  });

  return { removeRate, isLoadingRemoveRate };
}

// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
