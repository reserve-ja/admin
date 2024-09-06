import { Ref } from "vue";
import { http } from "./http";
import { useQuery } from "@tanstack/vue-query";
import { PaymentMethod } from "./payment.types";

export function useBookingDetails(hotelId: Ref<string>, bookingId: Ref<string>) {
  const { data: booking, isPending: isLoadingBooking } = useQuery<Booking>({
    queryKey: ['booking', { hotelId: hotelId.value, bookingId: bookingId.value }],
    queryFn: async () => {
      const { data } = await http.get(`/hotels/${hotelId.value}/bookings/${bookingId.value}`);

      return data;
    }
  });

  return { booking, isLoadingBooking };
}

export async function searchBookings(
  hotelId: string,
  checkinFrom?: Date,
  checkinTo?: Date,
  paymentMethod?: PaymentMethod,
  status?: BookingStatus,
) {
  const params: {
    checkinFrom?: string,
    checkinTo?: string,
    paymentMethod?: PaymentMethod,
    status?: BookingStatus,
  } = {};

  if (checkinFrom) params.checkinFrom = checkinFrom.toISOString().substring(0, 10);
  if (checkinTo) params.checkinTo = checkinTo.toISOString().substring(0, 10);
  if (paymentMethod) params.paymentMethod = paymentMethod;
  if (status) params.status = status;

  const { data } = await http.get<Booking[]>(`/hotels/${hotelId}/bookings`, { params });

  return data;
}

export type Booking = {
  id: string,
  checkin: string,
  checkout: string,
  paymentMethod: PaymentMethod,
  status: BookingStatus,
  mainGuest: Person,
  rooms: BookingRoom[],
  creationTime: string,
}

export enum BookingStatus {
  Unknown = "Unknown",
  WaitingPreBook = "WaitingPreBook",
  PreBooked = "PreBooked",
  Booked = "Booked",
  Canceled = "Canceled",
}

export function allStatus(): BookingStatus[] {
  return Object.values(BookingStatus).filter(s => s !== BookingStatus.Unknown);
}

export function translateStatus(status?: BookingStatus) {
  switch (status) {
    case BookingStatus.WaitingPreBook:
      return "Aguardando Pré-Reserva";
    case BookingStatus.PreBooked:
      return "Pré-Reservado";
    case BookingStatus.Booked:
      return "Reservado";
    case BookingStatus.Canceled:
      return "Cancelado";
    default:
      return '';
  }
}

export type Person = {
  fullName: string,
  email: string,
  phone: string,
  document: string,
}

export type BookingRoom = {
  roomId: string,
  totalGuests: number,
  totalPrice: number,
  priceDetails: PriceDetails[],
}

export type PriceDetails = {
  start: string,
  end: string,
  pricePerNight: number
}
