export const useDataStore = defineStore("dataStore", {
  state: () => ({
    collectedData: {
      libelle: "Nouvelle demande",
      site_id_fk: 0,
      nbr_agent: 0,
      nbr_equipement: 0,
      nbr_Imp: 0,
      nbr_kit: 0,
      type_equipement_id: 1,
      objectif: 0,
      date: "",
      date_fin: "",
      realise: 0,
      equipe_id_fk: 0,
      tranche_horaire_id: 0,
      type_operation: 0,
      detailag: [],
      detaileq: [],
    },
    dateSelected: null,
  }),
  getters: {
    getDateSelected: (state) => state.dateSelected,
  },
  actions: {
    updateData(newData: any) {
      console.log("Before update:", this.collectedData); // Log avant mise à jour
      this.collectedData = { ...this.collectedData, ...newData };
      console.log("After update:", this.collectedData); // Log après mise à jour
    },
    deleteData() {
      console.log("Before delete:", this.collectedData); // Log avant suppression

      // Réinitialiser collectedData à son état initial
      this.collectedData = {
        libelle: "Nouvelle demande",
        site_id_fk: 0,
        nbr_agent: 0,
        nbr_equipement: 0,
        type_equipement_id: 0,
        objectif: 0,
        date: "",
        date_fin: "",
        realise: 0,
        equipe_id_fk: 0,
        tranche_horaire_id: 0,
        type_operation: 0,
        detailag: [],
        detaileq: [],
        nbr_Imp: 0,
        nbr_kit: 0,
      };

      console.log("After delete:", this.collectedData); // Log après suppression
    },

    deleteDate() {
      this.dateSelected = null;
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

    setDateSelected(d: any) {
      this.dateSelected = d;
    },

    async indexTrancheHoraire() {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://192.168.192.16:8000/api/",
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
          "http://192.168.192.16:8000/api/",
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

    async getStat() {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://192.168.192.16:8000/api/",
          token
        );

        const response = await apiWithoutAuth.get("v1/operationjournaliere");

        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getStatByUser(idUser: any) {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://192.168.192.16:8000/api/",
          token
        );

        const response = await apiWithoutAuth.get(
          `v1/operationjournaliereByRespo/${idUser}`
        );

        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
