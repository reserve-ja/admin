import { useQuery } from "@tanstack/vue-query";
import { http } from "./http";
import { Hotel } from "./hotel.types";
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
      console.log('fetch')
      const { session } = useAuth();
      if (!session.value) {
        console.log('no session')
        return [];
      }

      console.log('fetching')
      const { data } = await http.get<Hotel[]>('/hotels');

      if (!hotelId.value || hotelId.value === '') {
        console.log('changed hotel id')
        hotelId.value = data[0].id;
      }

      return data;
    },
  });

  return { hotels, isLoadingHotels };
}
