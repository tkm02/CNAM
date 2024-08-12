export const useManageStore = defineStore("manage", {
  actions: {
    async getStatTeam(idSite:any, date: any) {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://192.168.192.16:8000/api/",
          token
        );

        const response = await apiWithoutAuth.get(
          `v1/recap/${idSite}/${date}`
        );
       console.log(response.data);
       
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getKit(id: any) {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://192.168.192.16:8000/api/",
          token
        );

        const response = await apiWithoutAuth.get(`v1/listeEquipementBySite/${id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getAgentsByEquipe(id: any) {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://192.168.192.16:8000/api/",
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
