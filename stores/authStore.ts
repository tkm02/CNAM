export const useAuthStore = defineStore("auth", {
  actions: {
    async login(data: any) {
      try {
        const config = useRuntimeConfig();
        const tokenStore = useTokenStore();
        const { apiWithoutAuth } = createApi("http://192.168.192.16:8000/api", tokenStore);

        const response = await apiWithoutAuth.post(`/login`, data);
        return response;
      } catch (error) {
        throw error;
      }
    },
  },
});
