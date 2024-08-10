export const useAuthStore = defineStore("auth", {
  actions: {
    async login(data: any) {
      try {
        const config = useRuntimeConfig();
        const tokenStore = useTokenStore();
        const { apiWithoutAuth } = createApi("http://192.168.252.170:8000/api", tokenStore);

        const response = await apiWithoutAuth.post(`/login`, data);
        return response;
      } catch (error) {
        throw error;
      }
    },
  },
});
