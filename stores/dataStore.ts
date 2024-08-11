export const useDataStore = defineStore('dataStore', {
  state: () => ({
    collectedData: {
      libelle: 'toto',
      site_id_fk: '1',
      nbr_agent: 0,
      nbr_equipement: 0,
      type_equipement_id: 1,
      objectif: 1000,
      date: '2024-08-10 00:55:21.0000000',
      realise: 500,
      equipe_id_fk: 1,
      tranche_horaire: '08:00-12:00',
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
  },
});