export const useTokenStore = defineStore("token", {
  state() {
    return {
      access_token: null,
      id: null,
      loggedIn: false,
      data: null,
      siteId: null,
    };
  },
  persist: true,
  getters: {
    getStatus: (state) => state.loggedIn,
    getToken: (state) => state.access_token,
    getId: (state) => state.id,
    getSiteId: (state) => state.siteId,
  },
  actions: {
    setToken(token: any) {
      this.access_token = token;
      this.loggedIn = true;
    },

    setId(id: any) {
      this.id = id;
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
