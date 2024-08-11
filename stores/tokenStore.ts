export const useTokenStore = defineStore("token", {
  state() {
    return {
      access_token: null,
      id: null,
      loggedIn: false,
      data: [],
      siteId: null,
      localites: null,
    };
  },
  persist: true,
  getters: {
    getStatus: (state) => state.loggedIn,
    getToken: (state) => state.access_token,
    getId: (state) => state.id,
    getSiteId: (state) => state.siteId,
    getLocalites: (state) => state.localites,
    getData: (state) => state.data,
  },
  actions: {
    setToken(token: any) {
      this.access_token = token;
      this.loggedIn = true;
    },

    setLocalities(data: any) {
      this.localites = data;
    },

    setId(id: any) {
      this.id = id;
    },

    setData(data: any) {
      this.data = data;
    },

    setSiteId(id: any) {
      this.siteId = id;
    },

    deleteToken() {
      this.access_token = null;
      this.loggedIn = false;
      this.id = null;
      this.siteId = null;
    },
  },
});
