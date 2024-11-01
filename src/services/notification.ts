import { useMutation, useQuery } from "@tanstack/vue-query";
import { Channel, NewChannel } from "./notification.types";
import { http } from "./http";
import { Ref } from "vue";
import { queryClient } from "./query";
import { AxiosError } from "axios";
import { ProblemDetails } from "./error.types";
import { useErrors } from "./error";

const { pushError } = useErrors();

export function useChannels(hotelId: Ref<string>) {
  const { data: channels, isPending: isLoadingChannels } = useQuery<Channel[]>({
    queryKey: ['channels', { hotelId }],
    queryFn: async () => {
      if (!hotelId.value) {
        return [];
      }

      const { data } = await http.get<Channel[]>(`/notification/hotels/${hotelId.value}/channels`);
      return data.sort((a, b) => a.id.localeCompare(b.id));
    }
  });

  return { channels, isLoadingChannels };
}

export function useToggleChannel() {
  const { mutateAsync: toggleChannel, isPending: isLoadingToggleChannel } = useMutation({
    mutationFn: async (input: { hotelId: string, channel: Channel }) => {
      const { hotelId, channel } = input;

      const action = channel.isEnabled ? 'disable' : 'enable';

      const { data } = await http.post(`/notification/hotels/${hotelId}/channels/${channel.id}/${action}`);

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['channels', { hotelId: variables.hotelId } ],
        exact: true,
        refetchType: "all",
      });
    },
    onError: (error: AxiosError<ProblemDetails>) => {
      pushError(error.response?.data.code);
    },
  });

  return { toggleChannel, isLoadingToggleChannel };
}

export function useAddChannel() {
  const { mutateAsync: addChannel, isPending: isLoadingAddChannel } = useMutation({
    mutationFn: async (input: { channel: NewChannel, hotelId: string } ) => {
      const { hotelId, channel } = input;

      const { data } = await http.post(`/notification/hotels/${hotelId}/channels`, channel);

      return data;
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ 'channels', { hotelId: variables.hotelId } ],
        exact: true,
        refetchType: "all",
      });
    },
  });

  return { addChannel, isLoadingAddChannel };
}

export function useEditChannel() {
  const { mutateAsync: editChannel, isPending: isLoadingEditChannel } = useMutation({
    mutationFn: async (input: { hotelId: string, channel: Channel }) => {
      const { hotelId, channel } = input;
      const { data } = await http.put(`/notification/hotels/${hotelId}/channels/${channel.id}`, channel);
      return data;
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ 'channels', { hotelId: variables.hotelId } ],
        exact: true,
        refetchType: "all",
      });

      queryClient.fetchQuery({ queryKey: [ 'channels', { hotelId: variables.hotelId } ] });
    },
    onError: (error: AxiosError<ProblemDetails>) => {
      pushError(error.response?.data.code);
    },
  });

  return { editChannel, isLoadingEditChannel };
}

export function useRemoveChannel() {
  const { mutateAsync: removeChannel, isPending: isLoadingRemoveChannel } = useMutation({
    mutationFn: async (input: { hotelId: string, channelId: string }) => {
      const { hotelId, channelId } = input;
      const { data } = await http.delete(`/notification/hotels/${hotelId}/channels/${channelId}`);
      return data;
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ 'channels', { hotelId: variables.hotelId } ],
        exact: true,
        refetchType: "all",
      });

      queryClient.fetchQuery({ queryKey: [ 'channels', { hotelId: variables.hotelId } ] });
    },
    onError: (error: AxiosError<ProblemDetails>) => {
      pushError(error.response?.data.code);
    },
  });

  return { removeChannel, isLoadingRemoveChannel };
}
