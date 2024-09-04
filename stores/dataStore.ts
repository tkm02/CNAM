export const useDataStore = defineStore("dataStore", {
  state: () => ({
    collectedData: {
      libelle: "Test",
      site_id_fk: 0,
      nbr_agent: 0,
      nbr_equipement: 0,
      nbr_Imp: 0,
      nbr_kit: 0,
      nbr_mobi: 0,
      type_equipement_id: 1,
      objectif: 0,
      date: "",
      date_fin: "",
      realise: 0,
      equipe_id_fk: 0,
      tranche_horaire_id: 0,
      type_operation: 0,
      detailop: [],
      detailag: [],
      detaileq: [],
      commentaire_globale_chief: "",
      globl_comment_superviseur: "",
      signature_chef: "",
      signature_superviseur: "",
      statut: 0,
      date_validation: "",
    },
    dateSelected: null,
    validTrue: false,
  }),
  // persist: true,
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
        libelle: "test",
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
        detailop: [],
        nbr_Imp: 0,
        nbr_kit: 0,
        nbr_mobi: 0,
        statut: 0,
        commentaire_globale_chief: "",
        globl_comment_superviseur: "",
        signature_chef: "",
        signature_superviseur: "",
        date_validation:''
      };

      console.log("After delete:", this.collectedData); // Log après suppression
    },

    deleteDate() {
      this.dateSelected = null;
    },

    addDetailAg(detail: {
      commentaire: string;
      agent_id_fk: number;
      type_probleme_id_fk: number;
      nom_eq: string;
    }) {
      // Trouver le détail existant dans detailag
      const existingDetailIndex = this.collectedData.detailag.findIndex(
        (d: any) => d.agent_id_fk === detail.agent_id_fk
      );

      if (existingDetailIndex !== -1) {
        // Mettre à jour le détail existant
        this.collectedData.detailag[existingDetailIndex] = {
          ...this.collectedData.detailag[existingDetailIndex],
          commentaire: detail.commentaire,
          type_probleme_id_fk: detail.type_probleme_id_fk,
        };
      } else {
        // Ajouter un nouveau détail s'il n'existe pas déjà
        this.collectedData.detailag.push(detail);
      }

      // Optionnel : Log pour débogage
      console.log("Updated detailag:", this.collectedData.detailag);
    },

    addDetailEq(detail: {
      equipement_id_fk: number;
      commentaire: string;
      type_probleme_id_fk: number;
      statut: string;
      nom_eq: string;
      type_eq: string;
    }) {
      const existingDetailIndex = this.collectedData.detaileq.findIndex(
        (d: any) => d.equipement_id_fk === detail.equipement_id_fk
      );

      if (existingDetailIndex !== -1) {
        // Si le détail existe déjà, mettre à jour
        this.collectedData.detaileq[existingDetailIndex] = {
          ...this.collectedData.detaileq[existingDetailIndex],
          ...detail, // Met à jour les propriétés avec les nouvelles valeurs
        };
      } else {
        // Sinon, ajouter un nouveau détail
        this.collectedData.detaileq.push(detail);
      }

      console.log("Updated detaileq:", this.collectedData.detaileq);
      console.log("After update:", this.collectedData);
    },

    addOperationDetail(
      agentName: string,
      nbrEnrolled: number,
      id_agent: number
    ) {
      const newDetail = {
        agent: agentName,
        nbr: nbrEnrolled,
        id_agent,
        // id_agent:id_agent
      };
      this.collectedData.detailop.push(newDetail);
      console.log("Updated detailop:", this.collectedData.detailop);
    },
    removeDetailEq(equipmentId: number) {
      this.collectedData.detaileq = this.collectedData.detaileq.filter(
        (d) => d.equipement_id_fk !== equipmentId
      );
      console.log(
        "Updated detaileq after removal:",
        this.collectedData.detaileq
      );
    },

    setDateSelected(d: any) {
      this.dateSelected = d;
    },

    async indexTrancheHoraire() {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://54.128.30.4/api",
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
          "http://54.128.30.4/api/",
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
          "http://54.128.30.4/api",
          token
        );

        const response = await apiWithoutAuth.get("v1/operationjournaliere");

        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getStatRecap(date: any) {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://54.128.30.4/api",
          token
        );

        const response = await apiWithoutAuth.get(
          `v1/recapGlobale/${date}/${date}`
        );

        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getStatByUser(idUser: any) {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://54.128.30.4/api",
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

    async validatePv(data:any) {
      try {
        const token = useTokenStore();
        const { apiWithoutAuth } = createApi(
          "http://57.128.30.4/api",
          token
        );
        const response = await apiWithoutAuth.post("/ValidatePvByRespo", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
