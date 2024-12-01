import { VueQueryPlugin, QueryClient, type VueQueryPluginOptions } from '@tanstack/vue-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, 
      refetchOnWindowFocus: false, 
    },
  },
});

const vueQueryOptions: VueQueryPluginOptions = {
  queryClient,
};

export { queryClient, VueQueryPlugin, vueQueryOptions };
