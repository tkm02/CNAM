export const useAuthStore = defineStore("auth", {
  actions: {
    async login(data: any) {
      try {
        const config = useRuntimeConfig();
        const tokenStore = useTokenStore();
        const { apiWithoutAuth } = createApi("http://57.128.30.4/api", tokenStore);

        const response = await apiWithoutAuth.post(`/login`, data);
        return response;
      } catch (error) {
        throw error;
      }
    },
  },
});
