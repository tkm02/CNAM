// utils/api.js
import axios from "axios";

export function createApi(config: any, tokenStore: any) {
  const api = axios.create({
    baseURL: `${config}`,
    headers: {
      "Content-Type": "application/json, multipart/form-data",
    },
  });

  api.interceptors.request.use((config) => {
    if (tokenStore.getStatus) {
      config.headers.Authorization = `Bearer ${tokenStore.getToken}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        tokenStore.deleteToken();
        navigateTo("/login");
      }
      return Promise.reject(error);
    }
  );

  const apiWithoutAuth = axios.create({
    baseURL: `${config}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return { api, apiWithoutAuth };
}
