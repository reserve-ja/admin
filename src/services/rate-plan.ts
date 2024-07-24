import { computed, Ref } from "vue";
import { http } from "./http";
import { useQuery } from "@tanstack/vue-query";
import { RatePlan } from "./rate-plan.types";

export function useRatePlans(hotelId: Ref<string>) {
  const { data: ratePlans, isPending: isLoadingRatePlans } = useQuery<RatePlan[]>({
    queryKey: [ 'ratePlans', { hotelId } ],
    queryFn: async () => {
      const { data } = await http.get(`/hotels/${hotelId.value}/rate-plans`);
      return data;
    }
  });

  return { ratePlans, isLoadingRatePlans };
}

export function useRatePlan(hotelId: Ref<string>, ratePlanId: Ref<string>) {
  const { ratePlans, isLoadingRatePlans: isLoadingRatePlan } = useRatePlans(hotelId);

  const ratePlan = computed(() => ratePlans.value?.find(ratePlan => ratePlan.id === ratePlanId.value));

  return { ratePlan, isLoadingRatePlan };
}

