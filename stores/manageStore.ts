export const useManageStore = defineStore("manage", {
  actions: {
    async getStatTeam(idSite: any, date: any) {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://57.128.30.4/api/",
          token
        );

        const response = await apiWithoutAuth.get(`v1/recap/${idSite}/${date}`);
        console.log(response.data);

        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getTeamBySite() {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://57.128.30.4/api/",
          token
        );
        const response = await apiWithoutAuth.get(
          `v1/ListeEquipeBySite/${token.getDataInfo.valid_roles_and_sites[0].id_site}`
        );

        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getKit(id: any) {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://57.128.30.4/api/",
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
          "http://57.128.30.4/api/",
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

    async getAllOpDays(date_debut: any, date_fin: any) {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://57.128.30.4/api/",
          token
        );

        const response = await apiWithoutAuth.get(
          `v1/recapGlobale/${date_debut}/${date_fin}`
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getAgentWhoNotTeam() {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://57.128.30.4/api/",
          token
        );

        const response = await apiWithoutAuth.get(
          `v1/agentNotAssign/${token.getDataInfo.valid_roles_and_sites[0].id_site}`
        );

        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getRecapEquipement(date: any) {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://57.128.30.4/api/",
          token
        );
        const response = await apiWithoutAuth.get(
          `v1/recapEquipement/${token.getDataInfo.valid_roles_and_sites[0].id_site}/${date}`
        );

        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getRecapEquipe(id_equipe: number, date: string) {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://57.128.30.4/api",
          token
        );
        const response = await apiWithoutAuth.get(`/v1/recapEquipe/${id_equipe}/${date}/`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
