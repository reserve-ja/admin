import { ref } from "vue"
import { http } from "./http";

export type Room = {
  id: string,
}

export type RoomState = {
  rooms: Room[],
  loading: boolean,
  error: any|null,
}

export const roomsByHotel = ref<{[hotelId: string] : RoomState}>({});

export async function fetchHotelRooms(hotelId: string, force = false) {
  if (force === false && roomsByHotel.value[hotelId]) {
    return;
  }

  roomsByHotel.value[hotelId] = { rooms: [], loading: true, error: null };

  try {
    const response = await http.get(`/hotels/${hotelId}/rooms`);
    roomsByHotel.value[hotelId].rooms = response.data;
  } catch (error) {
    roomsByHotel.value[hotelId].error = true;
  } finally {
    roomsByHotel.value[hotelId].loading = false;
  }
}

export async function syncRooms(hotelId: string) {
  roomsByHotel.value[hotelId].loading = true;
  roomsByHotel.value[hotelId].rooms = [];

  try {
    await http.post(`/hotels/${hotelId}/rooms/import-from-pms`);
  } catch (error) {
    roomsByHotel.value[hotelId].error = true;
  }

  await fetchHotelRooms(hotelId, true);
}
