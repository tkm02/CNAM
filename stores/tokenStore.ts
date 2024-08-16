export const useTokenStore = defineStore("token", {
  state() {
    return {
      data: {
        access_token: "",
        agent: {
          id: 0,
          nom: "",
          contact: "",
          username: "",
        },
        valid_roles_and_sites: [
          {
            role_id: 0,
            role_name: "",
            site_name: "",
            id_site: 0,
            region: "",
            equip_id: "",
            nom_equipe: "",
          },
        ],
      },
      loggedIn: false,
      date: "",
      objectif: 0,
    };
  },
  persist: true,
  getters: {
    getDataInfo: (state) => state.data,
    getStatus: (state) => state.loggedIn,
    getDate: (state) => state.date,
    getObjectif: (state) => state.objectif,
  },
  actions: {
    updateInfo(newData: any) {
      this.data = { ...this.data, ...newData };
      this.loggedIn = true;
    },
    setDateSelected(date: any) {
      this.date = date;
    },
    setObjectif(objectif: any) {
      this.objectif = objectif;
    },
    deleteInfo() {
      this.loggedIn = false;
      this.data = {
        access_token: "",
        agent: {
          id: 0,
          nom: "",
          contact: "",
          username: "",
        },
        valid_roles_and_sites: [
          {
            role_id: 0,
            role_name: "",
            site_name: "",
            id_site: 0,
            region: "",
            equip_id: "",
            nom_equipe: "",
          },
        ],
      };
    },
  },
});
