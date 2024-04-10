import { queryClient } from '@/services/query';
import { VueQueryPlugin, VueQueryPluginOptions } from '@tanstack/vue-query'

export const queryPlugin = VueQueryPlugin;
export const queryOptions: VueQueryPluginOptions = {
  queryClient: queryClient,
}
