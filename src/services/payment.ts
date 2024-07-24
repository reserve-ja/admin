import { useMutation, useQuery } from "@tanstack/vue-query";
import { Ref, ref } from "vue";
import { http } from "./http";
import { Gateway, Payment } from "./payment.types";
import { queryClient } from "./query";
import { AxiosError } from "axios";
import { useErrors } from "./error";
import { ProblemDetails } from "./error.types";

const { pushError } = useErrors();

export function useGateways(hotelId: Ref<string>) {
  const { data: gateways, isPending: isLoadingGateways } = useQuery<Gateway[]>({
    queryKey: ['gateways', { hotelId }],
    queryFn: async () => {
      if (!hotelId.value) {
        return [];
      }

      const { data } = await http.get<Gateway[]>(`/payments/hotels/${hotelId.value}/gateways`);
      return data.sort((a, b) => a.name.localeCompare(b.name));
    }
  });

  return { gateways, isLoadingGateways };
}

export function useAddGateway() {
  const { mutateAsync: addGateway, isPending: isLoadingAddGateway } = useMutation({
    mutationFn: async (input: { hotelId: string, gateway: Gateway }) => {
      const { hotelId, gateway } = input;
      const { data } = await http.post(`/payments/hotels/${hotelId}/gateways`, gateway);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['gateways', { hotelId: variables.hotelId } ],
        exact: true,
        refetchType: "all",
      });
    },
  });

  return { addGateway, isLoadingAddGateway };
}

export function useEditGateway() {
  const { mutateAsync: editGateway, isPending: isLoadingEditGateway } = useMutation({
    mutationFn: async (input: { hotelId: string, gateway: Gateway }) => {
      const { hotelId, gateway } = input;
      const { data } = await http.put(`/payments/hotels/${hotelId}/gateways/${gateway.id}`, gateway);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['gateways', { hotelId: variables.hotelId } ],
        exact: true,
        refetchType: "all",
      });
    },
    onError: (error: AxiosError<ProblemDetails>) => {
      pushError(error.response?.data.code);
    },
  });

  return { editGateway, isLoadingEditGateway };
}

const gatewayIdBeingToggled = ref<string>('');
export function useToggleGateway() {
  const { mutateAsync: toggleGateway, isPending: isLoadingToggleGateway } = useMutation({
    mutationFn: async (input: { hotelId: string, gateway: Gateway }) => {
      if (gatewayIdBeingToggled.value !== '') {
        return;
      }
      gatewayIdBeingToggled.value = input.gateway.id;

      const action = input.gateway.isActive ? 'disable' : 'enable';

      const { hotelId, gateway } = input;
      const { data } = await http.post(`/payments/hotels/${hotelId}/gateways/${gateway.id}/${action}`);

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['gateways', { hotelId: variables.hotelId } ],
        exact: true,
        refetchType: "all",
      });
    },
    onError: (error: AxiosError<ProblemDetails>) => {
      pushError(error.response?.data.code);
    },
    onSettled: () => {
      gatewayIdBeingToggled.value = '';
    },
  });

  const isBeingToggled = (gatewayId: string) => gatewayIdBeingToggled.value === gatewayId;

  return { toggleGateway, isLoadingToggleGateway, isBeingToggled };
}

export function usePaymentFromBooking(bookingId: Ref<string>) {
    const { data: payment, isPending: isLoadingPayment } = useQuery<Payment>({
      queryKey: ['payment', { bookingId }],
      queryFn: async () => {
        const { data } = await http.get<Payment>(`/payments/bookings/${bookingId.value}/payment`);
        return data;
      }
    })

    return { payment, isLoadingPayment };
}
