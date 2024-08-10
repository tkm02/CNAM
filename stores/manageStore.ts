export const useManageStore = defineStore("manage", {
  actions: {
    async getStatTeam(date: any) {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://192.168.252.170:8000/api/",
          token
        );

        const response = await apiWithoutAuth.get(`v1/recap/1/${date}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getKit(id: any) {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://192.168.252.170:8000/api/",
          token
        );

        const response = await apiWithoutAuth.get(
          `v1/listeEquipementBySite/${id}`
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getAgentsByEquipe(id: any) {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://192.168.252.170:8000/api/",
          token
        );

        const response = await apiWithoutAuth.get(
          `v1/listeAgentByEquipe/${id}`
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
