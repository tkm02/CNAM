export const useDataStore = defineStore("dataStore", {
  state: () => ({
    collectedData: {
      libelle: "toto",
      site_id_fk: 0,
      nbr_agent: 0,
      nbr_equipement: 0,
      nbr_Imp:0,
      nbr_kit:0,
      type_equipement_id: 1,
      objectif: 1000,
      date: "2024-08-10 00:55:21.0000000",
      realise: 500,
      equipe_id_fk: 1,
      tranche_horaire_id: 1,
      detailag: [],
      detaileq: [],
    },
  }),
  actions: {
    updateData(newData: any) {
      console.log("Before update:", this.collectedData); // Log avant mise à jour
      this.collectedData = { ...this.collectedData, ...newData };
      console.log("After update:", this.collectedData); // Log après mise à jour
    },

    addDetailAg(detail: { commentaire: string; agent_id_fk: number }) {
      // Ajoute un nouveau détail à l'objet detailag
      this.collectedData.detailag.push(detail);
      console.log("Updated detailag:", this.collectedData.detailag);
      console.log("After update:", this.collectedData); // Log
    },

    addDetailEq(detail: { equipement_id_fk: number; commentaire: string }) {
      // Ajoute un nouveau détail à l'objet detaileq
      this.collectedData.detaileq.push(detail);
      console.log("Updated detaileq:", this.collectedData.detaileq);
      console.log("After update:", this.collectedData); //
    },

    async indexTrancheHoraire() {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://192.168.252.170:8000/api/",
          token
        );

        const response = await apiWithoutAuth.get("v1/tranche");
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async addData(data: any) {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://192.168.252.170:8000/api/",
          token
        );
        const response = await apiWithoutAuth.post(
          "v1/operationJournaliere",
          data
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
