export const useTokenStore = defineStore("token", {
  state() {
    return {
      access_token: null,
      id: null,
      loggedIn: false,
      data: null,
    };
  },
  persist: true,
  getters: {
    getStatus: (state) => state.loggedIn,
    getToken: (state) => state.access_token,
    getId: (state) => state.id,
    getData: (state) => state.data,
  },
  actions: {
    setToken(token: any) {
      this.access_token = token;
      this.loggedIn = true;
    },

    setId(id: any) {
      this.id = id;
    },

    setData(data: any) {
      this.data = data;
    },

    deleteToken() {
      this.access_token = null;
      this.loggedIn = false;
    },

    deleteId() {
      this.id = null;
    },
  },
});
