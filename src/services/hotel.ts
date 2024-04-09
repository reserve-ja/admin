import { useQuery } from "@tanstack/vue-query";
import { http } from "./http";
import { Hotel } from "./hotel.types";
import { session } from "@/store/auth";
import { ref } from "vue";

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

  // watchEffect(() => {
  //   const { data, isSuccess } = useHotels();
  //   if (!isSuccess) {
  //     return;
  //   }

  //   const hotel = data.value?.find(hotel => hotel.id === hotelId.value);
  //   if (!hotel) {
  //     return;
  //   }

  //   currentHotel.value = hotel;
  // })

  // const currentHotel = computed(() => {
  //   const emptyHotel: Hotel = {
  //     id: '',
  //     name: '',
  //     pms: '',
  //     configuration: '',
  //   };

  //   // return emptyHotel;

  //   const { data, isSuccess } = useHotels();
  //   if (!isSuccess) {
  //     return emptyHotel;
  //   }

  //   return data.value?.find(hotel => hotel.id === hotelId.value);
  // });

  return {
    hotelId,
    // currentHotel,
    changeCurrentHotel,
  };
}

export function useListHotels() {
  const { data: hotels, isPending: isLoadingHotels } = useQuery<Hotel[]>({
    queryKey: ['hotels'],
    queryFn: async () => {
      console.log('fetch')
      if (!session.value) {
        return [];
      }

      const { data } = await http.get<Hotel[]>('/hotels');

      if (!hotelId.value) {
        console.log('changed hotel id')
        hotelId.value = data[0].id;
      }

      return data;
    },
  });

  return { hotels, isLoadingHotels };
}
