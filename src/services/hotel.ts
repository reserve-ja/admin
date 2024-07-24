import { useMutation, useQuery } from "@tanstack/vue-query";
import { http } from "./http";
import { Hotel, Pms, PmsConfig } from "./hotel.types";
import { useAuth } from "@/services/auth";
import { ref } from "vue";
import { queryClient } from "./query";

const hotelId = ref<string>('');
// const currentHotel = ref<Hotel>({
//   id: '',
//   name: '',
//   pms: '',
//   configuration: '',
// });

export function useCurrentHotel() {
  function changeCurrentHotel(newHotelId: string) {
    hotelId.value = newHotelId;
  }

  return {
    hotelId,
    changeCurrentHotel,
  };
}

export function useListHotels() {
  const { data: hotels, isPending: isLoadingHotels } = useQuery<Hotel[]>({
    queryKey: ['hotels'],
    queryFn: async () => {
      const { session } = useAuth();
      if (!session.value) {
        return [];
      }

      const { data } = await http.get<Hotel[]>('/hotels');

      if (!hotelId.value || hotelId.value === '') {
        hotelId.value = data[0].id;
      }

      return data.map(h => lowercaseKeys(h)) as Hotel[];
    },
  });

  return { hotels, isLoadingHotels };
}

export function useEditHotel() {
  const { mutateAsync: editHotel, isPending: isLoadingEditHotel } = useMutation({
    mutationFn: async (input: { hotelId: string, name: string }) => {
      const { hotelId, name } = input;
      const { data } = await http.put(`/hotels/${hotelId}`, { name });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'], exact: true, refetchType: "all" });
    },
  });

  return { editHotel, isLoadingEditHotel };
}

export function useSetupPms() {
  const { mutateAsync: setupPms, isPending: isLoadingSetupPms } = useMutation({
    mutationFn: async (input: { hotelId: string, pms: Pms, configuration: PmsConfig }) => {
      const { hotelId, pms, configuration } = input;
      const { data } = await http.put(`/hotels/${hotelId}/pms`, { pms, configuration });
      return data;
    },
  });

  return { setupPms, isLoadingSetupPms };
}

type AnyObject = { [key: string]: any };
const lowercaseKeys = (obj: AnyObject, deep = true) =>
  Object.keys(obj).reduce((acc, key) => {
    const newKey = key.charAt(0).toLowerCase() + key.slice(1);
    acc[newKey] =
      deep && typeof obj[key] === "object" ? lowercaseKeys(obj[key]) : obj[key];
    return acc;
  }, {} as AnyObject);
